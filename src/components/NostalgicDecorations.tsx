import React from 'react';
import { Sparkles, Moon, Sun, Flame, Wind, Heart, Compass } from 'lucide-react';

export const NostalgicDecorations: React.FC = () => {
  return (
    <div className="w-full my-6 grid grid-cols-2 sm:grid-cols-4 gap-3 z-10">
      {/* Vintage Tibetan Prayer Flags Banner Card */}
      <div className="p-3.5 rounded-xl bg-[#1c130d]/80 border border-[#443020] flex flex-col justify-between shadow-lg">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-['Space_Mono']">
          <Wind className="w-3.5 h-3.5" />
          <span>Lhasa Wind</span>
        </div>
        <div className="my-2 flex items-center justify-between gap-1">
          <span className="w-4 h-5 rounded-sm bg-blue-600/80 transform -rotate-6 shadow" title="Blue: Sky / Space" />
          <span className="w-4 h-5 rounded-sm bg-stone-100/80 transform rotate-3 shadow" title="White: Air / Wind" />
          <span className="w-4 h-5 rounded-sm bg-red-600/80 transform -rotate-3 shadow" title="Red: Fire" />
          <span className="w-4 h-5 rounded-sm bg-emerald-600/80 transform rotate-6 shadow" title="Green: Water" />
          <span className="w-4 h-5 rounded-sm bg-amber-400/80 transform -rotate-2 shadow" title="Yellow: Earth" />
        </div>
        <div className="text-[11px] text-[#bcaaa4] font-['Cormorant_Garamond',serif] italic truncate">
          5 Cosmic Elements in Harmony
        </div>
      </div>

      {/* 1984 Ashram Audio Fidelity Card */}
      <div className="p-3.5 rounded-xl bg-[#1c130d]/80 border border-[#443020] flex flex-col justify-between shadow-lg">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-['Space_Mono']">
          <Compass className="w-3.5 h-3.5" />
          <span>Analog Fidelity</span>
        </div>
        <div className="my-2">
          <div className="text-sm font-['Space_Mono'] font-bold text-[#fef08a]">
            CrO2 • High Bias
          </div>
          <div className="text-[10px] text-[#8d7b68] font-['Space_Mono']">
            70µs Equalization • 432 Hz
          </div>
        </div>
        <div className="text-[11px] text-[#bcaaa4] font-['Cormorant_Garamond',serif] italic truncate">
          Recorded in Rishikesh, 1984
        </div>
      </div>

      {/* Zen Mind Beginners Mind */}
      <div className="p-3.5 rounded-xl bg-[#1c130d]/80 border border-[#443020] flex flex-col justify-between shadow-lg">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-['Space_Mono']">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Shoshin (初心)</span>
        </div>
        <div className="my-2">
          <div className="text-sm font-['Marcellus',serif] font-bold text-[#f5ebd7]">
            Beginner's Mind
          </div>
          <div className="text-[10px] text-[#8d7b68] font-['Space_Mono']">
            Empty cup receives all
          </div>
        </div>
        <div className="text-[11px] text-[#bcaaa4] font-['Cormorant_Garamond',serif] italic truncate">
          Zen Master Shunryu Suzuki
        </div>
      </div>

      {/* Bodhicitta Heart */}
      <div className="p-3.5 rounded-xl bg-[#1c130d]/80 border border-[#443020] flex flex-col justify-between shadow-lg">
        <div className="flex items-center gap-2 text-xs text-rose-400 font-['Space_Mono']">
          <Heart className="w-3.5 h-3.5" />
          <span>Bodhicitta</span>
        </div>
        <div className="my-2">
          <div className="text-sm font-['Marcellus',serif] font-bold text-[#f5ebd7]">
            Awakened Heart
          </div>
          <div className="text-[10px] text-[#8d7b68] font-['Space_Mono']">
            Compassion for all beings
          </div>
        </div>
        <div className="text-[11px] text-[#bcaaa4] font-['Cormorant_Garamond',serif] italic truncate">
          Sarva Mangalam Bhavatu
        </div>
      </div>
    </div>
  );
};
