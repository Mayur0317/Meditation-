import React from 'react';
import { X, Keyboard, Sparkles } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Space / P', desc: 'Toggle Cassette Play / Pause', tag: 'Playback' },
  { key: 'G', desc: 'Strike Deep Temple Monastery Gong', tag: 'Acoustic' },
  { key: 'T', desc: 'Ring High-Frequency Tingsha Cymbal', tag: 'Bell' },
  { key: 'M', desc: 'Toggle Master Audio Mute / Unmute', tag: 'Audio' },
  { key: 'V', desc: 'Toggle Cinema / Mountain Landscape View', tag: 'View' }
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#1c130d] border border-[#553b26] p-6 shadow-2xl text-[#f3e8d2]">
        {/* Close Button */}
        <button
          id="close-shortcuts-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#a1887f] hover:text-[#f3e8d2] hover:bg-[#2d1e14] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4 border-b border-[#3d2b1b] pb-3">
          <Keyboard className="w-5 h-5 text-amber-400" />
          <h2 className="font-['Marcellus',serif] text-lg sm:text-xl uppercase tracking-wider text-[#fef08a]">
            Sanctuary Keyboard Shortcuts
          </h2>
        </div>

        <p className="text-xs text-[#bcaaa4] font-['Cormorant_Garamond',serif] italic mb-4">
          Control your meditation sanctuary seamlessly with tactile physical keyboard strokes.
        </p>

        {/* Shortcuts List */}
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUTS.map(item => (
            <div
              key={item.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#25180f] border border-[#443020] hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-['Space_Mono'] font-bold px-2 py-1 rounded bg-[#160e0a] border border-amber-600/40 text-amber-300 shadow-inner">
                  {item.key}
                </span>
                <span className="text-xs sm:text-sm text-[#e0cfbb] font-['Marcellus',serif]">
                  {item.desc}
                </span>
              </div>
              <span className="text-[10px] font-['Space_Mono'] text-[#a1887f] uppercase px-2 py-0.5 rounded bg-[#1a120b]">
                {item.tag}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-[#3d2b1b] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 text-[#fef08a] border border-amber-500/60 hover:from-amber-600 hover:to-amber-800 text-xs font-['Marcellus',serif]"
          >
            Return to Meditation
          </button>
        </div>
      </div>
    </div>
  );
};
