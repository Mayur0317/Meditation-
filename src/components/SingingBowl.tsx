import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Sparkles, CircleDot, Disc3 } from 'lucide-react';
import { soundEngine } from '../utils/soundSynthesis';

const BOWL_FREQUENCIES = [
  { name: '432 Hz • Heart & Anahata', freq: 432, desc: 'Universal harmonic balance & deep peace' },
  { name: '528 Hz • Solfeggio Miracle', freq: 528, desc: 'Clarity, transformation & DNA vitality' },
  { name: '216 Hz • Root Grounding', freq: 216, desc: 'Earth stability & releasing restlessness' },
  { name: '369 Hz • Tesla Harmony', freq: 369, desc: 'Vibrational resonance with sacred geometry' }
];

export const SingingBowl: React.FC = () => {
  const [selectedFreqIdx, setSelectedFreqIdx] = useState<number>(0);
  const [vibrating, setVibrating] = useState<boolean>(false);
  const [rings, setRings] = useState<{ id: number; scale: number; opacity: number }[]>([]);
  const [strikeCount, setStrikeCount] = useState<number>(0);
  const bowlRef = useRef<HTMLDivElement | null>(null);

  const activeFreq = BOWL_FREQUENCIES[selectedFreqIdx];

  const handleStrike = (e?: React.MouseEvent) => {
    soundEngine.playSingingBowl(activeFreq.freq, 0.85);
    setVibrating(true);
    setStrikeCount(prev => prev + 1);

    // Spawn expanding ripple ring
    const newRingId = Date.now() + Math.random();
    setRings(prev => [...prev, { id: newRingId, scale: 1, opacity: 0.9 }]);

    setTimeout(() => {
      setVibrating(false);
    }, 600);
  };

  // Clean up ripple rings over time
  useEffect(() => {
    if (rings.length === 0) return;
    const timer = setTimeout(() => {
      setRings(prev => prev.slice(1));
    }, 1800);
    return () => clearTimeout(timer);
  }, [rings]);

  const handleGong = () => {
    soundEngine.playTempleGong();
    const newRingId = Date.now();
    setRings(prev => [...prev, { id: newRingId, scale: 1.2, opacity: 1 }]);
  };

  const handleTingsha = () => {
    soundEngine.playTingsha();
  };

  return (
    <div id="singing-bowl-station" className="relative flex flex-col items-center bg-[#18130e]/80 border border-[#443322]/60 rounded-2xl p-5 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Background warm radial aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/50 pointer-events-none" />

      {/* Header */}
      <div className="w-full flex items-center justify-between z-10 mb-2 border-b border-[#3d2b1b]/60 pb-3">
        <div className="flex items-center gap-2.5">
          <Disc3 className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <h3 className="font-['Marcellus',serif] text-base sm:text-lg text-[#f3e8d2] tracking-wider uppercase">
            Tibetan Singing Bowl
          </h3>
        </div>
        <span className="text-[11px] font-['Space_Mono'] text-amber-300/80 px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/40">
          7-Metal Hand Hammered Alloy
        </span>
      </div>

      {/* Interactive Bowl Stage */}
      <div className="relative w-full h-64 sm:h-72 flex items-center justify-center my-2">
        {/* Animated Sonic Resonance Ripple Rings */}
        {rings.map(ring => (
          <div
            key={ring.id}
            className="absolute rounded-full pointer-events-none border border-amber-400/60 animate-ping"
            style={{
              width: '180px',
              height: '180px',
              animationDuration: '2.4s'
            }}
          />
        ))}

        {/* The 3D Brass Singing Bowl Graphic */}
        <div
          ref={bowlRef}
          id="strike-bowl-target"
          onClick={handleStrike}
          className={`group relative w-48 h-48 sm:w-56 sm:h-56 rounded-full cursor-pointer flex items-center justify-center transition-transform duration-300 select-none ${
            vibrating ? 'scale-95' : 'hover:scale-[1.03]'
          }`}
          title="Click to strike the singing bowl and generate pure acoustic resonance"
        >
          {/* Cushion Mat (Embroidered Tibetan Silk Pad) */}
          <div className="absolute inset-x-4 bottom-[-10px] h-16 bg-gradient-to-r from-red-900 via-amber-800 to-red-950 rounded-full border-2 border-amber-700/60 shadow-[0_8px_20px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <div className="w-full h-full border-dashed border-amber-400/30 rounded-full scale-90" />
          </div>

          {/* Main Hand-Hammered Brass Bowl Outer Body */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-[#d4af37] via-[#996515] to-[#4a2e00] p-1.5 shadow-[inset_0_4px_12px_rgba(255,255,255,0.4),0_12px_32px_rgba(0,0,0,0.9)] border-2 border-[#ffecb3]/40">
            {/* Hammered texture concentric rings & Sanskrit mantra etching */}
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#3a200a] via-[#8c5a1e] to-[#cba358] p-3 flex flex-col items-center justify-center relative overflow-hidden">
              
              {/* Antique Patina & Rim highlight */}
              <div className="absolute inset-0 rounded-full border-[6px] border-[#ffd54f]/50 opacity-70" />
              <div className="absolute inset-2 rounded-full border border-amber-300/30 opacity-60" />
              
              {/* Center Sacred Sanskrit Om */}
              <div className="z-10 text-center flex flex-col items-center">
                <span className="text-3xl sm:text-4xl text-[#ffecb3] font-['Cormorant_Garamond',serif] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform">
                  ॐ
                </span>
                <span className="text-[10px] tracking-widest text-[#ffe082] uppercase font-['Space_Mono'] mt-1 opacity-90">
                  {activeFreq.freq} Hz
                </span>
                <span className="text-[9px] text-[#ffecb3]/70 italic mt-0.5">
                  Tap to Strike
                </span>
              </div>

              {/* Wooden Mallet Striker Indicator Icon */}
              <div className="absolute top-2 right-4 transform rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                <div className="w-2.5 h-12 bg-gradient-to-b from-[#8d6e63] to-[#4e342e] rounded-sm border border-[#a1887f]/60 shadow-md">
                  <div className="w-3.5 h-4 bg-red-900/90 -ml-0.5 rounded-t-sm border border-amber-500/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequency Tuning Selector */}
      <div className="w-full mt-2 pt-3 border-t border-[#3d2b1b]/60 flex flex-col gap-2.5 z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#bcaaa4] font-['Space_Mono']">Tuning Scale:</span>
          <span className="text-amber-300 font-['Cormorant_Garamond',serif] text-sm italic">{activeFreq.desc}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {BOWL_FREQUENCIES.map((item, idx) => (
            <button
              key={item.freq}
              id={`freq-btn-${item.freq}`}
              onClick={() => {
                setSelectedFreqIdx(idx);
                soundEngine.playSingingBowl(item.freq, 0.7);
              }}
              className={`px-2 py-1.5 rounded-lg border text-left text-xs transition-all ${
                selectedFreqIdx === idx
                  ? 'bg-amber-900/60 border-amber-400/80 text-amber-200 shadow-md'
                  : 'bg-[#22160e] border-[#443322] text-[#d7ccc8] hover:bg-[#2d1e14] hover:text-amber-300'
              }`}
            >
              <div className="font-['Space_Mono'] font-bold text-[11px]">{item.freq} Hz</div>
              <div className="text-[10px] text-[#a1887f] truncate">{item.name.split('•')[1] || item.name}</div>
            </button>
          ))}
        </div>

        {/* Secondary Traditional Percussion Instruments */}
        <div className="flex items-center justify-between pt-2 border-t border-[#3d2b1b]/40">
          <span className="text-[11px] text-[#a1887f] font-['Space_Mono']">Resonant Chimes:</span>
          <div className="flex items-center gap-2">
            <button
              id="tingsha-bell-btn"
              onClick={handleTingsha}
              className="flex items-center gap-1 px-3 py-1 rounded bg-[#2a1d13] border border-[#553b26] text-[#f3e8d2] hover:bg-[#3d2a1b] hover:text-amber-300 transition-colors text-xs font-['Marcellus',serif]"
              title="Ring the high-frequency Tingsha meditation bells"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Tingsha Bell</span>
            </button>
            <button
              id="temple-gong-btn"
              onClick={handleGong}
              className="flex items-center gap-1 px-3 py-1 rounded bg-[#2a1d13] border border-[#553b26] text-[#f3e8d2] hover:bg-[#3d2a1b] hover:text-amber-300 transition-colors text-xs font-['Marcellus',serif]"
              title="Strike the deep ashram monastery gong"
            >
              <CircleDot className="w-3 h-3 text-amber-400" />
              <span>Temple Gong</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
