import React, { useEffect, useRef, useMemo } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  brightness: number;
  parallaxFactor: number;
  isHero: boolean;
  trail: { x: number; y: number }[];
}

interface ParticleBackgroundProps {
  scrollProgress: number;
  particleCount?: number;
  className?: string;
  colorScheme?: 'blue' | 'purple' | 'orange' | 'green';
}

function rgbaString(rgba: string, alpha: number) {
  return rgba.replace(/([\d.]+)\)$/g, `${alpha})`);
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  scrollProgress,
  particleCount = 100,
  className = '',
  colorScheme = 'blue'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const lastScrollY = useRef(0);

  const colorSchemes = useMemo(() => ({
    blue: {
      primary: ['rgba(79, 195, 247, 0.8)', 'rgba(41, 182, 246, 0.7)', 'rgba(3, 169, 244, 0.6)'],
      secondary: ['rgba(129, 212, 250, 0.5)', 'rgba(100, 181, 246, 0.4)'],
      hero: ['rgba(79, 195, 247, 1)', 'rgba(41, 182, 246, 0.9)', 'rgba(3, 169, 244, 0.8)']
    },
    purple: {
      primary: ['rgba(156, 39, 176, 0.8)', 'rgba(142, 36, 170, 0.7)', 'rgba(123, 31, 162, 0.6)'],
      secondary: ['rgba(186, 104, 200, 0.5)', 'rgba(171, 71, 188, 0.4)'],
      hero: ['rgba(156, 39, 176, 1)', 'rgba(142, 36, 170, 0.9)', 'rgba(123, 31, 162, 0.8)']
    },
    orange: {
      primary: ['rgba(255, 152, 0, 0.8)', 'rgba(255, 143, 0, 0.7)', 'rgba(255, 111, 0, 0.6)'],
      secondary: ['rgba(255, 183, 77, 0.5)', 'rgba(255, 167, 38, 0.4)'],
      hero: ['rgba(255, 152, 0, 1)', 'rgba(255, 143, 0, 0.9)', 'rgba(255, 111, 0, 0.8)']
    },
    green: {
      primary: ['rgba(76, 175, 80, 0.8)', 'rgba(67, 160, 71, 0.7)', 'rgba(56, 142, 60, 0.6)'],
      secondary: ['rgba(129, 199, 132, 0.5)', 'rgba(102, 187, 106, 0.4)'],
      hero: ['rgba(76, 175, 80, 1)', 'rgba(67, 160, 71, 0.9)', 'rgba(56, 142, 60, 0.8)']
    }
  }), []);

  const initializeParticles = useMemo(() => (width: number, height: number) => {
    const particles: Particle[] = [];
    const colors = colorSchemes[colorScheme];

    for (let i = 0; i < particleCount; i++) {
      const isHero = Math.random() < 0.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isHero ? Math.random() * 0.2 + 0 : Math.random() * 1 + 1,
        speedX: 0,
        speedY: 1,
        opacity: isHero ? Math.random() * 0.4 + 0.6 : Math.random() * 0.6 + 0.4,
        color: (isHero ? colors.hero : colors.primary)[Math.floor(Math.random() * 3)],
        brightness: Math.random() * 0.5 + (isHero ? 0.7 : 0.5),
        parallaxFactor: Math.random() * 0.6 + 0.4,
        isHero,
        trail: []
      });
    }

    return particles;
  }, [particleCount, colorScheme, colorSchemes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initializeParticles(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentScrollY = window.scrollY;
      const scrollDelta = (currentScrollY - lastScrollY.current) * 2;
      lastScrollY.current = currentScrollY;

      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY + scrollDelta * p.parallaxFactor;

        if (p.y < -p.size) p.y = canvas.height + p.size;
        if (p.y > canvas.height + p.size) p.y = -p.size;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 1) p.trail.shift();

        for (let i = 1; i < p.trail.length - 10; i++) {
          const t1 = p.trail[i];
          const t2 = p.trail[i + 10];
          const alpha = (i + 1) / p.trail.length * p.opacity * 1.6;
          const size = p.size * (i + 1) / p.trail.length;

          ctx.beginPath();
          ctx.strokeStyle = rgbaString(p.color, alpha);
          ctx.lineWidth = size;
          ctx.moveTo(t1.x, t1.y);
          ctx.lineTo(t2.x, t2.y);
          ctx.stroke();
        }

        ctx.save();
        ctx.globalAlpha = p.opacity * p.brightness;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 0;
        ctx.shadowColor = p.color;
        ctx.beginPath(); 100,
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 20);
        ctx.fill();

        if (p.isHero) {
          ctx.globalAlpha = 10;
          ctx.fillStyle = 'rgba(255, 255, 255, 1)';
          ctx.shadowBlur = 5;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath(); 100
          ctx.arc(p.x, p.y, p.size * 2.3, 102, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore(); 
      });

      animationRef.current = requestAnimationFrame(animate); 
    };

    animate();

    return () => { 
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ background: 'transparent', mixBlendMode: 'screen' }}
    />
  );
};

export { ParticleBackground };
