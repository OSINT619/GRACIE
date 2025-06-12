import React, { useRef, useEffect, useState } from 'react';

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulseSpeed: number;
  pulseOffset: number;
}

interface FireflyCanvasProps {
  numberOfFireflies?: number;
  className?: string;
  colorTheme?: number; // Keep for compatibility but won't be used
}

export const FireflyCanvas: React.FC<FireflyCanvasProps> = ({
  numberOfFireflies = 50,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const firefliesRef = useRef<Firefly[]>([]);
  const [isHovering, setIsHovering] = useState(false);

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

    // Initialize fireflies
    const initFireflies = () => {
      firefliesRef.current = [];
      for (let i = 0; i < numberOfFireflies; i++) {
        firefliesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    initFireflies();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      firefliesRef.current.forEach((firefly) => {
        // Update position
        firefly.x += firefly.vx;
        firefly.y += firefly.vy;

        // Bounce off edges
        if (firefly.x <= 0 || firefly.x >= canvas.width) firefly.vx *= -1;
        if (firefly.y <= 0 || firefly.y >= canvas.height) firefly.vy *= -1;

        // Keep within bounds
        firefly.x = Math.max(0, Math.min(canvas.width, firefly.x));
        firefly.y = Math.max(0, Math.min(canvas.height, firefly.y));

        // Update opacity with pulsing effect
        const pulseOpacity = Math.sin(Date.now() * firefly.pulseSpeed + firefly.pulseOffset) * 0.2 + 0.8;
        const currentOpacity = firefly.opacity * pulseOpacity;

        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
          firefly.x, firefly.y, 0,
          firefly.x, firefly.y, firefly.size * 3
        );

        // Set color based on hover state
        if (isHovering) {
          // Black when hovering
          gradient.addColorStop(0, `rgba(0, 0, 0, ${currentOpacity})`);
          gradient.addColorStop(0.5, `rgba(0, 0, 0, ${currentOpacity * 0.5})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          // White when not hovering
          gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${currentOpacity * 0.5})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        // Draw firefly
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.size, 0, Math.PI * 2);
        ctx.fill();
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
  }, [numberOfFireflies, isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <canvas
      ref={canvasRef}
      className={`firefly-canvas ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto', // Changed to auto to detect hover
        background: 'transparent',
        zIndex: 'inherit'
      }}
    />
  );
};