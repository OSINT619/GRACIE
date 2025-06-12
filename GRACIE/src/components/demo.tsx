import { AIAnalysisTool } from "@/components/ui/ai-analysis-tool";
import { ParticleBackground } from "@/components/ui/particle-background";
import { GracieAnimation } from "@/components/ui/gracie-animation";
import Spline from "@splinetool/react-spline";
import { Spotlight } from "@/components/ui/spotlight";
import { FireflyCanvas } from "@/components/ui/firefly-canvas";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useLenis } from "@/hooks/useLenis";

const DemoOne = () => {
  const [scrollY, setScrollY] = useState(0);
  const lenis = useLenis();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
  }, []);

  const scrollToAnalysisTool = useCallback(() => {
    const targetY = window.innerHeight * 4;

    if (lenis) {
      lenis.scrollTo(targetY, {
        duration: 2.5,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }
  }, [lenis]);

  useEffect(() => {
    let ticking = false;

    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    if (lenis) {
      lenis.on('scroll', ({ scroll }: { scroll: number }) => {
        setScrollY(scroll);
      });
    } else {
      window.addEventListener('scroll', throttledScroll, { passive: true });
    }

    return () => {
      if (lenis) {
        lenis.off('scroll', throttledScroll);
      } else {
        window.removeEventListener('scroll', throttledScroll);
      }
    };
  }, [lenis, handleScroll]);

  const scrollProgress = useMemo(() => {
    const vh = window.innerHeight;
    return {
      section1: Math.min(1, scrollY / vh),
      section2: Math.min(1, Math.max(0, (scrollY - vh) / vh)),
      section3: Math.min(1, Math.max(0, (scrollY - vh * 2) / vh)),
      section4: Math.min(1, Math.max(0, (scrollY - vh * 3) / vh)),
      section5: Math.min(1, Math.max(0, (scrollY - vh * 4) / vh))
    };
  }, [scrollY]);

  const transformStyles = useMemo(() => ({
    hero: {
      transform: `translateY(${scrollY * 0.5}px)`,
      opacity: Math.max(0, 1 - scrollProgress.section1 * 1.5)
    },
    section2: {
      transform: `translateY(${(scrollY - window.innerHeight) * 0.3}px)`,
      opacity: Math.max(0, 1 - scrollProgress.section2 * 1.2)
    },
    section3: {
      transform: `translateY(${(scrollY - window.innerHeight * 2) * 0.3}px)`,
      opacity: Math.max(0, 1 - scrollProgress.section3 * 1.2)
    },
    section4: {
      transform: `translateY(${(scrollY - window.innerHeight * 3) * 0.3}px)`,
      opacity: Math.max(0, 1 - scrollProgress.section4 * 1.2)
    }
  }), [scrollY, scrollProgress]);

  return (
    <div className="relative w-full">
      {/* Hero Section with Layered Effects */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Fireflies - Behind Everything */}
        <div className="absolute inset-0 z-[-1] gpu-accelerated">
          <FireflyCanvas 
            numberOfFireflies={80}
            className="opacity-100"
          />
        </div>

        {/* Spotlight Effect - Behind Robot */}
        <div className="absolute inset-0 z-[-5] gpu-accelerated">
          <Spotlight className="opacity-80" />
        </div>
        
        {/* Spline 3D Scene - Interactive Layer */}
        <div className="absolute inset-0 z-[1] spline-container pointer-events-auto">
          <Spline 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'auto',
              zIndex: 1
            }}
            onLoad={() => {
              console.log('Spline scene loaded successfully');
            }}
            onError={(error) => {
              console.error('Spline scene failed to load:', error);
            }}
          />
        </div>
        
        {/* Foreground Fireflies - In Front of Robot */}
        <div className="absolute inset-0 z-[2] pointer-events-none gpu-accelerated">
          <FireflyCanvas 
            numberOfFireflies={50}
            className="opacity-100"
          />
        </div>
        
        {/* GRACIE Text Animation - Top Layer */}
        <div 
          className="absolute z-10 w-full h-full pointer-events-none flex flex-col justify-center items-center will-change-transform gpu-accelerated"
          style={transformStyles.hero}
        >
          <GracieAnimation />
        </div>

        {/* Ultra-Smooth Feathered Top Transition */}
        <div 
          className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
          style={{
            height: '25vh',
            background: `linear-gradient(to bottom, 
              #000000 0%,
              rgba(0,0,0,0.995) 5%,
              rgba(0,0,0,0.98) 10%,
              rgba(0,0,0,0.94) 15%,
              rgba(0,0,0,0.87) 20%,
              rgba(0,0,0,0.78) 25%,
              rgba(0,0,0,0.67) 30%,
              rgba(0,0,0,0.56) 35%,
              rgba(0,0,0,0.46) 40%,
              rgba(0,0,0,0.37) 45%,
              rgba(0,0,0,0.29) 50%,
              rgba(0,0,0,0.22) 55%,
              rgba(0,0,0,0.16) 60%,
              rgba(0,0,0,0.11) 65%,
              rgba(0,0,0,0.07) 70%,
              rgba(0,0,0,0.04) 75%,
              rgba(0,0,0,0.02) 80%,
              rgba(0,0,0,0.01) 85%,
              transparent 90%,
              transparent 100%)`
          }}
        />

        {/* Ultra-Smooth Feathered Bottom Transition */}
        <div 
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
          style={{
            height: '40vh',
            background: `linear-gradient(to bottom, 
              transparent 0%, 
              transparent 10%,
              rgba(0,0,0,0.01) 15%,
              rgba(0,0,0,0.02) 20%,
              rgba(0,0,0,0.04) 25%,
              rgba(0,0,0,0.07) 30%,
              rgba(0,0,0,0.11) 35%,
              rgba(0,0,0,0.16) 40%,
              rgba(0,0,0,0.22) 45%,
              rgba(0,0,0,0.29) 50%,
              rgba(0,0,0,0.37) 55%,
              rgba(0,0,0,0.46) 60%,
              rgba(0,0,0,0.56) 65%,
              rgba(0,0,0,0.67) 70%,
              rgba(0,0,0,0.78) 75%,
              rgba(0,0,0,0.87) 80%,
              rgba(0,0,0,0.94) 85%,
              rgba(0,0,0,0.98) 90%,
              rgba(0,0,0,0.995) 95%,
              #000000 100%)`
          }}
        />

        {/* Ultra-Smooth Feathered Left Edge Transition */}
        <div 
          className="absolute top-0 bottom-0 left-0 z-20 pointer-events-none"
          style={{
            width: '15vw',
            background: `linear-gradient(to right, 
              #000000 0%,
              rgba(0,0,0,0.995) 5%,
              rgba(0,0,0,0.98) 10%,
              rgba(0,0,0,0.94) 15%,
              rgba(0,0,0,0.87) 20%,
              rgba(0,0,0,0.78) 25%,
              rgba(0,0,0,0.67) 30%,
              rgba(0,0,0,0.56) 35%,
              rgba(0,0,0,0.46) 40%,
              rgba(0,0,0,0.37) 45%,
              rgba(0,0,0,0.29) 50%,
              rgba(0,0,0,0.22) 55%,
              rgba(0,0,0,0.16) 60%,
              rgba(0,0,0,0.11) 65%,
              rgba(0,0,0,0.07) 70%,
              rgba(0,0,0,0.04) 75%,
              rgba(0,0,0,0.02) 80%,
              rgba(0,0,0,0.01) 85%,
              transparent 90%,
              transparent 100%)`
          }}
        />

        {/* Ultra-Smooth Feathered Right Edge Transition */}
        <div 
          className="absolute top-0 bottom-0 right-0 z-20 pointer-events-none"
          style={{
            width: '15vw',
            background: `linear-gradient(to left, 
              #000000 0%,
              rgba(0,0,0,0.995) 5%,
              rgba(0,0,0,0.98) 10%,
              rgba(0,0,0,0.94) 15%,
              rgba(0,0,0,0.87) 20%,
              rgba(0,0,0,0.78) 25%,
              rgba(0,0,0,0.67) 30%,
              rgba(0,0,0,0.56) 35%,
              rgba(0,0,0,0.46) 40%,
              rgba(0,0,0,0.37) 45%,
              rgba(0,0,0,0.29) 50%,
              rgba(0,0,0,0.22) 55%,
              rgba(0,0,0,0.16) 60%,
              rgba(0,0,0,0.11) 65%,
              rgba(0,0,0,0.07) 70%,
              rgba(0,0,0,0.04) 75%,
              rgba(0,0,0,0.02) 80%,
              rgba(0,0,0,0.01) 85%,
              transparent 90%,
              transparent 100%)`
          }}
        />
      </section>

      {/* Second Section - "Are you being Manipulated?" with Particle Background */}
      <section className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden">
        {/* Particle Background with Parallax */}
        <ParticleBackground 
          scrollProgress={scrollProgress.section2}
          particleCount={120}
          className="z-0"
        />
        
        <div 
          className="frosted-glass-card group will-change-transform relative z-10 w-full flex items-center justify-center gpu-accelerated"
          style={transformStyles.section2}
        >
          <div className="frosted-glass-content">
            <h2 className="illuminated-text text-4xl md:text-6xl font-light tracking-wide text-white text-center">
              Are you being Manipulated?
            </h2>
          </div>
        </div>
      </section>

      {/* Third Section - "Gaslit?" with Particle Background */}
      <section className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden">
        {/* Particle Background with Different Color Scheme */}
        <ParticleBackground 
          scrollProgress={scrollProgress.section3}
          particleCount={100}
          className="z-0"
          colorScheme="purple"
        />
        
        <div 
          className="frosted-glass-card group will-change-transform relative z-10 w-full flex items-center justify-center gpu-accelerated"
          style={transformStyles.section3}
        >
          <div className="frosted-glass-content">
            <h2 className="illuminated-text text-5xl md:text-7xl font-light tracking-wide text-white text-center">
              Gaslit?
            </h2>
          </div>
        </div>
      </section>

      {/* Fourth Section - "It's time to regain control" with Particle Background */}
      <section className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden">
        {/* Particle Background with Red/Orange Theme */}
        <ParticleBackground 
          scrollProgress={scrollProgress.section4}
          particleCount={140}
          className="z-0"
          colorScheme="orange"
        />
        
        <div 
          className="frosted-glass-card group will-change-transform relative z-10 w-full flex items-center justify-center gpu-accelerated"
          style={transformStyles.section4}
        >
          <div className="frosted-glass-content">
            <div className="text-center max-w-4xl">
              <h2 className="illuminated-text text-4xl md:text-6xl font-light tracking-wide text-white mb-8">
                It's time to regain control
              </h2>
              <button
                onClick={scrollToAnalysisTool}
                className="frosted-button px-8 py-3 rounded-lg text-lg font-medium hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fifth Section - AI Analysis Tool with Particle Background */}
      <section className="relative min-h-screen w-full bg-black overflow-hidden">
        {/* Subtle Particle Background for Tool Section */}
        <ParticleBackground 
          scrollProgress={scrollProgress.section5}
          particleCount={80}
          className="z-0 opacity-60"
          colorScheme="green"
        />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center py-20 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <AIAnalysisTool />
          </div>
        </div>
      </section>
    </div>
  );
};

export { DemoOne };