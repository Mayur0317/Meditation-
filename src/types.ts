export type ThemeAtmosphere = 'dusk' | 'himalaya' | 'monsoon' | 'zen' | 'starlight';

export interface SutraWisdom {
  id: string;
  sanskrit?: string;
  english: string;
  author: string;
  source: string;
  year?: string;
  reflection: string;
}

export interface AmbientTrack {
  id: string;
  name: string;
  category: 'nature' | 'analog' | 'frequency';
  volume: number;
  isActive: boolean;
  iconName: string;
}

export interface MalaSession {
  count: number;
  rounds: number;
  mantra: string;
  target: number;
}

export type BreathPattern = 'box' | 'relax' | 'deep' | 'prana';

export interface BreathConfig {
  name: string;
  description: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  benefit: string;
}
