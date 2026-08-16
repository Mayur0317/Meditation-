import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Heart, CheckCircle2, ChevronRight } from 'lucide-react';
import { MANTRAS_LIST } from '../data/meditationContent';
import { soundEngine } from '../utils/soundSynthesis';

export const MalaCounter: React.FC = () => {
  const [selectedMantraIdx, setSelectedMantraIdx] = useState<number>(0);
  const [beadCount, setBeadCount] = useState<number>(0);
  const [completedMalas, setCompletedMalas] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const activeMantra = MANTRAS_LIST[selectedMantraIdx];

  const handleAdvanceBead = () => {
    soundEngine.playMalaClick();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);

    setBeadCount(prev => {
      const next = prev + 1;
      if (next >= 108) {
        // Guru Bead reached! Ring sacred tingsha
        soundEngine.playTingsha();
        setCompletedMalas(c => c + 1);
        return 0;
      }
      return next;
    });
  };

  const handleReset = () => {
    setBeadCount(0);
    soundEngine.playWaterDrop();
  };

  return (
    <div id="mala-bead-counter" className="relative flex flex-col items-center bg-[#18130e]/80 border border-[#443322]/60 rounded-2xl p-5 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-600/10 via-transparent to-black/40 pointer-events-none" />

      {/* Header */}
      <div className="w-full flex items-center justify-between z-10 mb-3 border-b border-[#3d2b1b]/60 pb-3">
        <div className="flex items-center gap-2.5">
          <Heart className="w-4 h-4 text-rose-400/90" />
          <h3 className="font-['Marcellus',serif] text-base sm:text-lg text-[#f3e8d2] tracking-wider uppercase">
            108 Japa Mala Counter
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-['Space_Mono'] text-amber-300/90 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/60">
            {completedMalas} {completedMalas === 1 ? 'Mala' : 'Malas'} Done
          </span>
          <button
            id="reset-mala-btn"
            onClick={handleReset}
            className="p-1 rounded-full text-[#a1887f] hover:text-amber-300 hover:bg-[#2d1e14] transition-colors"
            title="Reset counter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Mantra Showcase Card */}
      <div className="w-full bg-gradient-to-r from-[#24170f] via-[#2d1e14] to-[#24170f] border border-[#553b26]/70 rounded-xl p-3.5 mb-4 text-center z-10 shadow-inner">
        <div className="text-xl sm:text-2xl text-[#fde047] font-['Cormorant_Garamond',serif] font-bold tracking-wide">
          {activeMantra.sanskrit}
        </div>
        <div className="text-sm text-[#f3e8d2] font-['Marcellus',serif] mt-0.5">
          {activeMantra.romanized}
        </div>
        <div className="text-xs text-[#d7ccc8] font-['Cormorant_Garamond',serif] italic mt-1 max-w-sm mx-auto">
          "{activeMantra.meaning}"
        </div>
      </div>

      {/* Large Interactive Bead Dial / Disc */}
      <div className="relative w-full flex flex-col items-center justify-center my-1 z-10">
        {/* Bead Ring Visualizer */}
        <div
          id="click-mala-bead-target"
          onClick={handleAdvanceBead}
          className={`relative w-44 h-44 sm:w-48 sm:h-48 rounded-full border-2 border-dashed border-amber-600/40 bg-gradient-to-b from-[#2a1b12] to-[#160e0a] flex flex-col items-center justify-center cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.8)] select-none transition-transform ${
            isAnimating ? 'scale-95' : 'hover:scale-[1.03]'
          }`}
          title="Click or tap Spacebar to count next mantra bead"
        >
          {/* Decorative Sandalwood Beads on Perimeter */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 78;
            const bx = Math.cos(angle) * radius;
            const by = Math.sin(angle) * radius;
            const isCurrent = Math.floor((beadCount / 108) * 12) === i;

            return (
              <div
                key={i}
                className={`absolute w-4 h-4 rounded-full transition-all duration-300 shadow-md ${
                  isCurrent
                    ? 'bg-amber-300 scale-125 ring-2 ring-amber-400'
                    : 'bg-gradient-to-br from-[#8d5b28] via-[#5c3a17] to-[#3a200a]'
                }`}
                style={{
                  transform: `translate(${bx}px, ${by}px)`,
                }}
              />
            );
          })}

          {/* Central Counter Display */}
          <div className="text-center flex flex-col items-center z-10 pointer-events-none">
            <span className="text-4xl sm:text-5xl font-bold font-['Space_Mono'] text-[#fef08a] drop-shadow-md">
              {beadCount}
            </span>
            <span className="text-[11px] font-['Space_Mono'] text-[#d7ccc8] uppercase tracking-widest mt-1">
              / 108 Beads
            </span>
            <span className="text-[10px] text-amber-400/80 font-['Marcellus',serif] italic mt-1">
              Click to Count
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mt-4 bg-[#2a1c12] rounded-full h-2 overflow-hidden border border-[#553b26]/50">
          <div
            className="bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-300"
            style={{ width: `${(beadCount / 108) * 100}%` }}
          />
        </div>
      </div>

      {/* Mantra Switcher */}
      <div className="w-full mt-3 pt-3 border-t border-[#3d2b1b]/60 flex items-center justify-between text-xs z-10">
        <span className="text-[#a1887f] font-['Space_Mono']">Tradition:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[240px] sm:max-w-none">
          {MANTRAS_LIST.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMantraIdx(idx);
                soundEngine.playTingsha();
              }}
              className={`px-2 py-1 rounded text-[11px] whitespace-nowrap transition-colors ${
                selectedMantraIdx === idx
                  ? 'bg-amber-900/80 text-amber-200 border border-amber-600'
                  : 'bg-[#22160e] text-[#bcaaa4] hover:bg-[#2d1e14] hover:text-[#f3e8d2]'
              }`}
            >
              {m.romanized.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
