import React, { useState } from 'react';
import { Volume2, VolumeX, Keyboard, Sparkles, Eye, EyeOff } from 'lucide-react';
import { soundEngine } from '../utils/soundSynthesis';

interface HeaderNavProps {
  onOpenShortcuts: () => void;
  isZenCinemaMode?: boolean;
  onToggleZenCinema?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenShortcuts,
  isZenCinemaMode = false,
  onToggleZenCinema
}) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMasterMute(next);
  };

  return (
    <header className="w-full pt-6 pb-4 px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#3d2b1b]/50 z-20">
      {/* Brand Title & Vintage Stamp */}
      <div className="flex items-center gap-3 text-center md:text-left">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 via-amber-800 to-amber-950 border border-amber-400/60 shadow-lg flex items-center justify-center text-amber-200 font-['Cormorant_Garamond',serif] font-bold text-xl select-none shrink-0">
          ॐ
        </div>
        <div>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <h1 className="text-2xl sm:text-3xl font-bold font-['Cormorant_Garamond',serif] tracking-wider text-[#f5ebd7] drop-shadow">
              NIRVANA '84
            </h1>
            <span className="text-[10px] font-['Space_Mono'] bg-amber-950/80 border border-amber-600/60 text-amber-300 px-1.5 py-0.5 rounded tracking-widest uppercase">
              Analog Zen Sanctuary
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#bcaaa4] font-['Marcellus',serif] italic mt-0.5 drop-shadow-sm">
            Rishikesh • Kyoto • Lhasa • High Bias CrO2 Meditation
          </p>
        </div>
      </div>

      {/* Quick Actions & Shortcut Trigger */}
      <div className="flex items-center gap-2.5">
        {onToggleZenCinema && (
          <button
            id="toggle-cinema-mode-btn"
            onClick={onToggleZenCinema}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-['Marcellus',serif] transition-all ${
              isZenCinemaMode
                ? 'bg-amber-900/70 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-400/40'
                : 'bg-[#24170f]/90 border-[#553b26] text-[#e0cfbb] hover:bg-[#3d2a1b] hover:text-amber-300'
            }`}
            title="Toggle Cinema / Background Landscape Gaze Mode (Hotkey: V)"
          >
            {isZenCinemaMode ? <EyeOff className="w-3.5 h-3.5 text-amber-300" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{isZenCinemaMode ? 'Exit Cinema' : 'Cinema View'}</span>
          </button>
        )}

        <button
          id="strike-chime-quick-btn"
          onClick={() => soundEngine.playTingsha()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#24170f]/90 border border-[#553b26] text-[#e0cfbb] hover:bg-[#3d2a1b] hover:text-amber-300 hover:border-amber-400 transition-all text-xs font-['Marcellus',serif]"
          title="Strike Tibetan prayer chime"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Prayer Chime</span>
        </button>

        <button
          id="shortcuts-guide-btn"
          onClick={onOpenShortcuts}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#24170f]/90 border border-[#553b26] text-[#e0cfbb] hover:bg-[#3d2a1b] hover:text-amber-300 transition-all text-xs font-['Space_Mono']"
          title="View keyboard meditation shortcuts"
        >
          <Keyboard className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Shortcuts</span>
        </button>

        <button
          id="master-mute-nav-btn"
          onClick={toggleMute}
          className={`p-2 rounded-xl border transition-colors ${
            isMuted
              ? 'bg-red-950/80 border-red-800 text-red-400'
              : 'bg-[#24170f]/90 border-[#553b26] text-[#e0cfbb] hover:text-amber-300'
          }`}
          title={isMuted ? 'Unmute Audio' : 'Mute Master Audio (Hotkey: M)'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
