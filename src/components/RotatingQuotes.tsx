import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MEDITATION_QUOTES } from '../data/meditationQuotes';

interface RotatingQuotesProps {
  autoRotateInterval?: number; // milliseconds
}

export const RotatingQuotes: React.FC<RotatingQuotesProps> = ({
  autoRotateInterval = 16000 // Slow, peaceful, comfortable reading pace
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentQuote = MEDITATION_QUOTES[currentIndex];

  // Slow automated rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % MEDITATION_QUOTES.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [autoRotateInterval]);

  return (
    <motion.div
      layout
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="w-full px-4 sm:px-8 pointer-events-auto flex items-center justify-center"
    >
      {/* Fully Transparent Quotation Stage */}
      <div className="w-full max-w-4xl min-h-[120px] sm:min-h-[160px] flex items-center justify-center text-center p-2 sm:p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.id}
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="w-full"
          >
            <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-['Cormorant_Garamond',serif] italic font-normal text-[#fdf8ee] leading-relaxed sm:leading-snug drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] selection:bg-amber-400/30">
              "{currentQuote.quote}"
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
