import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, ChevronLeft, ChevronRight, Copy, Check, Quote, Feather } from 'lucide-react';
import { SUTRAS_DATA } from '../data/meditationContent';
import { soundEngine } from '../utils/soundSynthesis';

export const WisdomSutras: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isReflecting, setIsReflecting] = useState<boolean>(false);

  const sutra = SUTRAS_DATA[currentIndex];

  const handleNext = () => {
    soundEngine.playTingsha();
    setCurrentIndex(prev => (prev + 1) % SUTRAS_DATA.length);
  };

  const handlePrev = () => {
    soundEngine.playTingsha();
    setCurrentIndex(prev => (prev - 1 + SUTRAS_DATA.length) % SUTRAS_DATA.length);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${sutra.english}" — ${sutra.author} (${sutra.source})`);
    soundEngine.playWaterDrop();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="wisdom-sutra-scroll" className="relative flex flex-col items-center bg-[#18130e]/80 border border-[#443322]/60 rounded-2xl p-5 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-amber-700/10 via-transparent to-black/40 pointer-events-none" />

      {/* Header */}
      <div className="w-full flex items-center justify-between z-10 mb-3 border-b border-[#3d2b1b]/60 pb-3">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="font-['Marcellus',serif] text-base sm:text-lg text-[#f3e8d2] tracking-wider uppercase">
            Sacred Sutras & Timeless Koans
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-['Space_Mono'] text-[#a1887f]">
          <span>{currentIndex + 1}</span>
          <span>/</span>
          <span>{SUTRAS_DATA.length}</span>
        </div>
      </div>

      {/* Washi Parchment Scroll Card */}
      <div className="relative w-full my-2 p-5 sm:p-7 rounded-xl bg-gradient-to-b from-[#f5ebd7] via-[#efe1c8] to-[#e6d3b3] text-[#2c1a0e] shadow-[inset_0_2px_8px_rgba(0,0,0,0.1),0_10px_25px_rgba(0,0,0,0.6)] border border-[#c4ab80] z-10 transition-all duration-500">
        {/* Antique Red Wax Seal Stamp in corner */}
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gradient-to-br from-red-700 to-red-950 border-2 border-red-500/80 shadow-md flex items-center justify-center text-[#ffecb3] font-['Cormorant_Garamond',serif] font-bold text-sm select-none opacity-85">
          ॐ
        </div>

        {/* Sanskrit Header (if present) */}
        {sutra.sanskrit && (
          <div className="text-lg sm:text-xl text-[#7c2d12] font-['Cormorant_Garamond',serif] font-bold mb-2 tracking-wide">
            {sutra.sanskrit}
          </div>
        )}

        {/* Main Wisdom Quote */}
        <div className="relative my-3">
          <Quote className="w-6 h-6 text-[#9a3412]/30 absolute -top-3 -left-3" />
          <p className="font-['Cormorant_Garamond',serif] text-lg sm:text-2xl italic leading-relaxed text-[#261609] font-medium pl-3">
            "{sutra.english}"
          </p>
        </div>

        {/* Author & Source */}
        <div className="mt-4 pt-3 border-t border-[#cbb085]/60 flex flex-wrap items-center justify-between gap-2 text-xs font-['Space_Mono'] text-[#5c3e21]">
          <div className="flex items-center gap-1.5 font-bold">
            <Feather className="w-3.5 h-3.5 text-[#9a3412]" />
            <span>{sutra.author}</span>
          </div>
          <div className="text-[11px] text-[#785433] italic">
            {sutra.source} {sutra.year ? `(${sutra.year})` : ''}
          </div>
        </div>

        {/* Contemplation Guidance */}
        {isReflecting && (
          <div className="mt-3 pt-3 border-t border-dashed border-[#b89b70] text-xs font-['Marcellus',serif] text-[#4a2e12] animate-in fade-in duration-300">
            <span className="font-bold text-[#7c2d12]">Contemplation: </span>
            {sutra.reflection}
          </div>
        )}
      </div>

      {/* Navigation & Interaction Footer */}
      <div className="w-full mt-3 pt-3 border-t border-[#3d2b1b]/60 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <button
            id="prev-sutra-btn"
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-[#25180f] border border-[#443020] text-[#d7ccc8] hover:bg-[#332115] hover:text-amber-300 transition-colors"
            title="Previous sutra (or press J)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            id="next-sutra-btn"
            onClick={handleNext}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25180f] border border-[#443020] text-[#d7ccc8] hover:bg-[#332115] hover:text-amber-300 transition-colors text-xs font-['Marcellus',serif]"
            title="Next sutra (or press K)"
          >
            <span>Next Sutra</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="reflect-sutra-btn"
            onClick={() => {
              setIsReflecting(!isReflecting);
              soundEngine.playWaterDrop();
            }}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              isReflecting ? 'bg-amber-900/80 text-amber-200 border border-amber-600' : 'bg-[#25180f] text-[#a1887f] hover:text-[#f3e8d2]'
            }`}
          >
            {isReflecting ? 'Hide Reflection' : 'Reflect'}
          </button>
          <button
            id="copy-sutra-btn"
            onClick={handleCopy}
            className="p-1.5 rounded bg-[#25180f] border border-[#443020] text-[#d7ccc8] hover:text-amber-300 transition-colors"
            title="Copy sutra to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
