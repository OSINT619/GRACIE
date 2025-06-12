import { useEffect, useState } from 'react';

const GracieAnimation = () => {
  const [activeLetterIndex, setActiveLetterIndex] = useState(-1);
  const [animationStarted, setAnimationStarted] = useState(false);

  const letters = ['G', 'R', 'A', 'C', 'I', 'E'];
  const words = [
    'Grandiose',
    'Relational', 
    'Attribute',
    'Classification',
    'Intelligence',
    'Engine'
  ];

  useEffect(() => {
    // Start animation after a brief delay
    const startTimer = setTimeout(() => {
      setAnimationStarted(true);
    }, 6700);

    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!animationStarted) return;

    const interval = setInterval(() => {
      setActiveLetterIndex(prev => {
        if (prev < letters.length - 1) {
          return prev + 1;
        }
        return prev; // Stay at the last index, don't reset
      });
    }, 500); // 800ms delay between each letter

    return () => clearInterval(interval);
  }, [animationStarted, letters.length]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* GRACIE Title with Letter Animation */}
      <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-widest text-white whitespace-nowrap">
        {letters.map((letter, index) => (
          <span
            key={index}
            className={`gracie-letter ${
              index <= activeLetterIndex ? 'gracie-letter-active' : ''
            }`}
            style={{
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            {letter}
          </span>
        ))}
      </h1>

      {/* Words that are always visible but light up progressively */}
      <div className="text-sm md:text-base font-mono tracking-wide pointer-events-none max-w-4xl text-center">
        {words.map((word, index) => (
          <span
            key={index}
            className={`inline-block mx-1 transition-all duration-600 ${
              index <= activeLetterIndex 
                ? 'text-white/90 gracie-letter-active' 
                : 'text-white/30'
            }`}
            style={{
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            {word}
            {index < words.length - 1 && ' '}
          </span>
        ))}
      </div>
    </div>
  );
};

export { GracieAnimation };