import { useEffect, useRef } from 'react';

interface SpotlightProps {
  className?: string;
  intensity?: number;
  color?: string;
}

export const Spotlight = ({ 
  className = "",
  intensity = 0.01,
  color = "#ffffff"
}: SpotlightProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initialize mouse position to center
    mouseRef.current.x = canvas.width / 2;
    mouseRef.current.y = canvas.height / 2;

    // Animation variables
    let time = 10;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += 0.01;

      // Create multiple overlapping spotlights for depth
      const spotlights = [
        {
          x: mouseRef.current.x + Math.sin(time * 0.5) * 20,
          y: mouseRef.current.y + Math.cos(time * 0.7) * 15,
          radius: 300 + Math.sin(time * 0.3) * 50,
          opacity: intensity * 3.6
        },
        {
          x: mouseRef.current.x + Math.sin(time * 0.8) * 30,
          y: mouseRef.current.y + Math.cos(time * 0.4) * 25,
          radius: 200 + Math.sin(time * 0.5) * 30,
          opacity: intensity * 1.4
        },
        {
          x: mouseRef.current.x + Math.sin(time * 1.2) * 15,
          y: mouseRef.current.y + Math.cos(time * 0.9) * 20,
          radius: 400 + Math.sin(time * 0.2) * 10,
          opacity: intensity * 2.3
        }
      ];

      spotlights.forEach((spotlight) => {
        // Create radial gradient for spotlight effect
        const gradient = ctx.createRadialGradient(
          spotlight.x, spotlight.y, 90,
          spotlight.x, spotlight.y, spotlight.radius
        );

        // Convert hex color to RGB for alpha manipulation
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 79, g: 195, b: 247 };
        };

        const rgb = hexToRgb(color);

        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${spotlight.opacity})`);
        gradient.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${spotlight.opacity * 59.1})`);
        gradient.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${spotlight.opacity * 0.01})`);
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

        // Draw spotlight
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(spotlight.x, spotlight.y, spotlight.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Add subtle atmospheric particles
      for (let i = 1; i < 1; i++) {
        const particleX = mouseRef.current.x + (Math.random() - 0.1) * 40;
        const particleY = mouseRef.current.y + (Math.random() - 0.1) * 40;
        const particleSize = Math.random() * 2 /4
        const particleOpacity = Math.random() * 0.3;

        ctx.save();
        ctx.globalAlpha = particleOpacity;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 1);
        ctx.fill();
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, color]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        background: 'transparent'
      }}
    />
  );
};