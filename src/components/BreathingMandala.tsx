import React, { useState, useEffect, useRef } from 'react';
import { Wind, Play, Pause, RefreshCw, Sparkles, Activity } from 'lucide-react';
import { BREATH_CONFIGS } from '../data/meditationContent';
import { soundEngine } from '../utils/soundSynthesis';

type BreathPhase = 'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)';

export const BreathingMandala: React.FC = () => {
  const [patternKey, setPatternKey] = useState<string>('box');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [phase, setPhase] = useState<BreathPhase>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [scale, setScale] = useState<number>(1);
  const [cycleCount, setCycleCount] = useState<number>(0);

  const pattern = BREATH_CONFIGS[patternKey];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Set initial duration based on phase
    const getPhaseDuration = (p: BreathPhase) => {
      switch (p) {
        case 'Inhale': return pattern.inhale;
        case 'Hold (Full)': return pattern.holdIn || 1;
        case 'Exhale': return pattern.exhale;
        case 'Hold (Empty)': return pattern.holdOut || 1;
      }
    };

    let currentSec = secondsLeft;

    timerRef.current = setInterval(() => {
      currentSec -= 1;

      if (currentSec <= 0) {
        // Transition to next phase
        setPhase(prevPhase => {
          let nextPhase: BreathPhase = 'Inhale';
          if (prevPhase === 'Inhale') {
            nextPhase = pattern.holdIn > 0 ? 'Hold (Full)' : 'Exhale';
          } else if (prevPhase === 'Hold (Full)') {
            nextPhase = 'Exhale';
          } else if (prevPhase === 'Exhale') {
            nextPhase = pattern.holdOut > 0 ? 'Hold (Empty)' : 'Inhale';
            if (pattern.holdOut === 0) setCycleCount(c => c + 1);
          } else if (prevPhase === 'Hold (Empty)') {
            nextPhase = 'Inhale';
            setCycleCount(c => c + 1);
          }

          currentSec = getPhaseDuration(nextPhase);
          setSecondsLeft(currentSec);

          // Gentle sound cue
          if (nextPhase === 'Inhale' || nextPhase === 'Exhale') {
            soundEngine.playTingsha();
          }

          return nextPhase;
        });
      } else {
        setSecondsLeft(currentSec);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, patternKey, phase]);

  // Handle visual scale smoothly based on breath phase
  useEffect(() => {
    if (phase === 'Inhale') {
      setScale(1.45);
    } else if (phase === 'Hold (Full)') {
      setScale(1.45);
    } else if (phase === 'Exhale') {
      setScale(0.85);
    } else if (phase === 'Hold (Empty)') {
      setScale(0.85);
    }
  }, [phase]);

  const toggleGuide = () => {
    setIsActive(!isActive);
    soundEngine.playWaterDrop();
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'Inhale': return 'from-teal-500/30 via-emerald-600/20 to-amber-500/20 text-emerald-300 border-emerald-400/50';
      case 'Hold (Full)': return 'from-amber-500/30 via-yellow-600/20 to-orange-500/20 text-yellow-300 border-yellow-400/50';
      case 'Exhale': return 'from-indigo-500/30 via-purple-600/20 to-rose-500/20 text-indigo-300 border-indigo-400/50';
      case 'Hold (Empty)': return 'from-stone-600/30 via-neutral-700/20 to-stone-800/20 text-stone-300 border-stone-400/50';
    }
  };

  return (
    <div id="prana-breathing-mandala" className="relative flex flex-col items-center bg-[#18130e]/80 border border-[#443322]/60 rounded-2xl p-5 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between z-10 mb-2 border-b border-[#3d2b1b]/60 pb-3">
        <div className="flex items-center gap-2.5">
          <Wind className="w-4 h-4 text-emerald-400" />
          <h3 className="font-['Marcellus',serif] text-base sm:text-lg text-[#f3e8d2] tracking-wider uppercase">
            Prana Breathing Mandala
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-['Space_Mono'] text-emerald-300/90 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40">
            {cycleCount} Cycles
          </span>
          <button
            id="toggle-breathing-btn"
            onClick={toggleGuide}
            className="p-1 rounded-full text-[#a1887f] hover:text-emerald-300 hover:bg-[#2d1e14] transition-colors"
            title={isActive ? 'Pause breath guide' : 'Start breath guide'}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Pattern Description */}
      <div className="w-full text-center text-xs text-[#bcaaa4] font-['Cormorant_Garamond',serif] italic mb-2">
        {pattern.name} — {pattern.description}
      </div>

      {/* Animated Lotus Mandala Visualizer */}
      <div className="relative w-full h-64 sm:h-72 flex items-center justify-center my-1 select-none">
        {/* Sacred Geometry Lotus Mandala */}
        <div
          className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center transition-all duration-[3000ms] ease-in-out"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {/* Luminous Pulsating Halo */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr ${getPhaseColor()} blur-xl transition-opacity duration-1000 opacity-70`}
          />

          {/* Concentric Geometric Mandala Petals */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-amber-300/40 opacity-60 transition-transform duration-1000"
              style={{
                transform: `rotate(${i * 45}deg) translate(28px, 28px)`,
              }}
            />
          ))}

          {/* Central Breath Core */}
          <div
            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 bg-[#1b120c]/90 shadow-2xl flex flex-col items-center justify-center text-center p-2 z-10 transition-colors duration-700 ${
              phase === 'Inhale' ? 'border-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.4)]' :
              phase === 'Hold (Full)' ? 'border-yellow-400 shadow-[0_0_24px_rgba(250,204,21,0.4)]' :
              phase === 'Exhale' ? 'border-indigo-400 shadow-[0_0_24px_rgba(129,140,248,0.4)]' :
              'border-stone-500 shadow-[0_0_24px_rgba(120,113,108,0.4)]'
            }`}
          >
            <span className="text-xs uppercase tracking-widest font-['Marcellus',serif] text-[#f3e8d2] font-semibold">
              {phase}
            </span>
            <span className="text-3xl font-bold font-['Space_Mono'] text-[#fef08a] mt-0.5">
              {secondsLeft}s
            </span>
            <span className="text-[9px] text-[#a1887f] font-['Space_Mono'] uppercase tracking-wider">
              {isActive ? 'Breathe' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Pattern Selector */}
      <div className="w-full mt-2 pt-3 border-t border-[#3d2b1b]/60 flex flex-col gap-2 z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#a1887f] font-['Space_Mono']">Pranayama Mode:</span>
          <span className="text-emerald-300/90 font-['Cormorant_Garamond',serif] text-xs italic">{pattern.benefit}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {Object.entries(BREATH_CONFIGS).map(([key, item]) => (
            <button
              key={key}
              id={`breath-pattern-${key}`}
              onClick={() => {
                setPatternKey(key);
                setPhase('Inhale');
                setSecondsLeft(item.inhale);
                soundEngine.playTingsha();
              }}
              className={`px-2 py-1.5 rounded-lg border text-left text-xs transition-all ${
                patternKey === key
                  ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 shadow-md'
                  : 'bg-[#22160e] border-[#443322] text-[#d7ccc8] hover:bg-[#2d1e14] hover:text-emerald-300'
              }`}
            >
              <div className="font-['Space_Mono'] font-bold text-[11px] truncate">{item.name.split('(')[0]}</div>
              <div className="text-[10px] text-[#a1887f]">
                {item.inhale}-{item.holdIn}-{item.exhale}{item.holdOut > 0 ? `-${item.holdOut}` : ''}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
