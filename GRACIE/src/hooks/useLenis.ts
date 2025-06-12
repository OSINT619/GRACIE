import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export const useLenis = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with ULTRA-OPTIMIZED settings for butter-smooth scrolling
    const lenis = new Lenis({
      duration: 1.2, // Reduced for snappier response
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Optimized easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1.0, // Increased for better responsiveness
      smoothTouch: false, // Disabled for better mobile performance
      touchMultiplier: 2.0, // Increased for better touch response
      infinite: false,
      syncTouch: false,
      syncTouchLerp: 0.075, // Optimized for smoothness
      touchInertiaMultiplier: 35,
      wheelMultiplier: 1.0, // Increased for better desktop experience
      normalizeWheel: true,
    });

    lenisRef.current = lenis;

    // ULTRA-OPTIMIZED animation frame loop with 120fps target
    let rafId: number;
    let lastTime = 0;
    const targetFPS = 30; // Further reduced FPS for better performance
    const frameInterval = 1000 / targetFPS;

    function raf(time: number) {
      if (time - lastTime >= frameInterval) {
        lenis.raf(time);
        lastTime = time;
      }
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Enhanced scroll prevention for maximum control
    const preventDefaultScroll = (e: WheelEvent) => {
      if (e.target === document.body || e.target === document.documentElement) {
        e.preventDefault();
      }
    };

    const preventTouchScroll = (e: TouchEvent) => {
      if (e.target === document.body || e.target === document.documentElement) {
        e.preventDefault();
      }
    };

    // Add optimized event listeners
    document.addEventListener('wheel', preventDefaultScroll, { passive: false });
    document.addEventListener('touchmove', preventTouchScroll, { passive: false });

    // Prevent scroll restoration on page reload
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Cleanup
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      document.removeEventListener('wheel', preventDefaultScroll);
      document.removeEventListener('touchmove', preventTouchScroll);
      lenis.destroy();
    };
  }, []);

  return lenisRef.current;
};