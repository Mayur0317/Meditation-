import React from 'react';
import { ThemeAtmosphere } from '../types';
import { ATMOSPHERE_THEMES } from '../data/meditationContent';
import { soundEngine } from '../utils/soundSynthesis';
import { Sun, Sunset, CloudRain, Mountain, Sparkles } from 'lucide-react';

interface AtmosphereSelectorProps {
  currentTheme: ThemeAtmosphere;
  onSelectTheme: (theme: ThemeAtmosphere) => void;
}

export const AtmosphereSelector: React.FC<AtmosphereSelectorProps> = ({ currentTheme, onSelectTheme }) => {
  const getIcon = (key: ThemeAtmosphere) => {
    switch (key) {
      case 'dusk': return <Sunset className="w-3.5 h-3.5" />;
      case 'himalaya': return <Mountain className="w-3.5 h-3.5" />;
      case 'monsoon': return <CloudRain className="w-3.5 h-3.5" />;
      case 'zen': return <Sun className="w-3.5 h-3.5" />;
      case 'starlight': return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full flex items-center justify-center my-4">
      <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-[#1c130d]/80 border border-[#443020] backdrop-blur-md shadow-xl">
        {(Object.keys(ATMOSPHERE_THEMES) as ThemeAtmosphere[]).map(key => {
          const theme = ATMOSPHERE_THEMES[key];
          const isSelected = currentTheme === key;

          return (
            <button
              key={key}
              id={`theme-btn-${key}`}
              onClick={() => {
                onSelectTheme(key);
                soundEngine.playTingsha();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-['Marcellus',serif] transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-800 to-amber-950 text-[#fef08a] border border-amber-500/80 shadow-md scale-105'
                  : 'text-[#bcaaa4] hover:text-[#f3e8d2] hover:bg-[#2a1d13]'
              }`}
            >
              <span style={{ color: isSelected ? theme.accentColor : undefined }}>
                {getIcon(key)}
              </span>
              <span>{theme.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
