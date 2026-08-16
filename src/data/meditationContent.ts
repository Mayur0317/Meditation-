import { SutraWisdom, BreathConfig, ThemeAtmosphere } from '../types';

export const SUTRAS_DATA: SutraWisdom[] = [
  {
    id: 'sutra-1',
    sanskrit: 'ॐ तत्त्वमसि (Tat Tvam Asi)',
    english: 'You are not the drop in the ocean; you are the entire ocean in a drop.',
    author: 'Rumi / Chandogya Upanishad',
    source: 'Ancient Upanishads',
    year: 'c. 800 BCE',
    reflection: 'Drop the separation between the observer and the observed. Breathe into the boundless space of awareness.'
  },
  {
    id: 'sutra-2',
    sanskrit: 'गते गते पारगते पारसंगते बोधि स्वाहा',
    english: 'Form is emptiness, emptiness is form. Gone, gone, gone beyond, fully awakened.',
    author: 'Prajnaparamita',
    source: 'The Heart Sutra',
    year: 'c. 100 CE',
    reflection: 'All thoughts, sensations, and fears are clouds drifting across an undisturbed blue sky.'
  },
  {
    id: 'sutra-3',
    sanskrit: 'अथ योगानुशासनम् (Atha Yoga Anushasanam)',
    english: 'Now, the inquiry into Yoga begins. Yoga is the stilling of the fluctuations of the mind.',
    author: 'Sage Patanjali',
    source: 'Yoga Sutras 1.1-1.2',
    year: 'c. 400 CE',
    reflection: 'When the ripples of thought settle, the inner sun reflects clearly on the tranquil water.'
  },
  {
    id: 'sutra-4',
    sanskrit: 'इहैव विप्रमुच्यते (Be Here Now)',
    english: 'The quieter you become, the more you are able to hear. Be here now.',
    author: 'Ram Dass & Baba Hari Dass',
    source: 'Lama Foundation Ashram',
    year: '1971',
    reflection: 'You do not have to become anything. Simply rest in this single, unfiltered breath.'
  },
  {
    id: 'sutra-5',
    sanskrit: '無 (Mu / Emptiness)',
    english: 'Muddy water is best cleared by leaving it alone.',
    author: 'Alan Watts',
    source: 'The Way of Zen',
    year: '1957',
    reflection: 'Stop trying to force the mind to be quiet. Allow whatever arises to dissolve naturally.'
  },
  {
    id: 'sutra-6',
    sanskrit: 'शान्तिः शान्तिः शान्तिः (Om Shanti)',
    english: 'Smile, breathe and go slowly. Peace is every step under our feet.',
    author: 'Thich Nhat Hanh',
    source: 'Plum Village',
    year: '1982',
    reflection: 'Each breath in is nourishment, each breath out is release and gratitude.'
  },
  {
    id: 'sutra-7',
    sanskrit: 'सो ऽहम् (So Hum)',
    english: 'I am That. Pure awareness witnessing the dance of time.',
    author: 'Nisargadatta Maharaj',
    source: 'I Am That',
    year: '1973',
    reflection: 'Inhale "So" (I am), Exhale "Hum" (That). Dissolve into the rhythm of the cosmos.'
  }
];

export const MANTRAS_LIST = [
  {
    id: 'om-mani',
    sanskrit: 'ॐ मणिपद्मे हूँ',
    romanized: 'Om Mani Padme Hum',
    meaning: 'The jewel is in the lotus — compassion and wisdom united',
    tradition: 'Tibetan Vajrayana'
  },
  {
    id: 'so-hum',
    sanskrit: 'सो ऽहम्',
    romanized: 'So Hum',
    meaning: 'I am That — unison of individual soul and cosmic breath',
    tradition: 'Vedic Prana'
  },
  {
    id: 'om-shanti',
    sanskrit: 'ॐ शान्तिः शान्तिः शान्तिः',
    romanized: 'Om Shanti Shanti Shanti',
    meaning: 'Peace in the mind, peace in nature, peace in cosmos',
    tradition: 'Upanishads'
  },
  {
    id: 'lokah',
    sanskrit: 'लोकाः समस्ताः सुखिनो भवन्तु',
    romanized: 'Lokah Samastah Sukhino Bhavantu',
    meaning: 'May all beings everywhere be happy and free',
    tradition: 'Sanskrit Blessing'
  }
];

export const BREATH_CONFIGS: Record<string, BreathConfig> = {
  box: {
    name: 'Sama Vritti (Box Breath)',
    description: 'Ancient square pacing for deep autonomic nervous system balance',
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    benefit: 'Reduces cortisol, stills racing thoughts, stabilizes heart rate variability'
  },
  relax: {
    name: 'Pranayama 4-7-8',
    description: 'The natural tranquilizer for sleep and tension release',
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    benefit: 'Stimulates the vagus nerve and activates the parasympathetic rest state'
  },
  deep: {
    name: 'Dirga Pranayama (3-Part)',
    description: 'Abdominal, diaphragmatic, and clavicular ocean wave breathing',
    inhale: 5,
    holdIn: 2,
    exhale: 6,
    holdOut: 2,
    benefit: 'Expands lung capacity and floods the bloodstream with vital oxygen'
  },
  prana: {
    name: 'Solfeggio Flow 5-5',
    description: 'Coherent heart-rate resonance at 0.1 Hz breathing frequency',
    inhale: 5,
    holdIn: 0,
    exhale: 5,
    holdOut: 0,
    benefit: 'Synchronizes brainwaves with heart rhythm for transcendent focus'
  }
};

export const ATMOSPHERE_THEMES: Record<ThemeAtmosphere, {
  name: string;
  subtitle: string;
  bgGradient: string;
  lanternColor: string;
  accentColor: string;
  textColor: string;
  borderColor: string;
  quote: string;
}> = {
  dusk: {
    name: 'Ashram Dusk',
    subtitle: 'Rishikesh 1984 • Amber Incense & Sacred Fire',
    bgGradient: 'from-[#140e0a] via-[#1a120b] to-[#0c0907]',
    lanternColor: '#d48b38',
    accentColor: '#e09f3e',
    textColor: '#f3e8d2',
    borderColor: 'rgba(212, 139, 56, 0.25)',
    quote: 'The evening bell echoes across the Ganges; mind comes home to silence.'
  },
  himalaya: {
    name: 'Himalayan Dawn',
    subtitle: 'Lhasa Monastery • High Altitude Crisp Radiance',
    bgGradient: 'from-[#0d161b] via-[#101b22] to-[#080d11]',
    lanternColor: '#5fa8d3',
    accentColor: '#8ecae6',
    textColor: '#e4f1f7',
    borderColor: 'rgba(95, 168, 211, 0.25)',
    quote: 'Above the mountain clouds, pure eternal morning fills the sky.'
  },
  monsoon: {
    name: 'Zen Monsoon',
    subtitle: 'Kyoto Temple Veranda • Rain on Bamboo Grove',
    bgGradient: 'from-[#0c1613] via-[#111e1a] to-[#070e0c]',
    lanternColor: '#52b788',
    accentColor: '#74c69d',
    textColor: '#e8f5e9',
    borderColor: 'rgba(82, 183, 136, 0.25)',
    quote: 'Listen to the rain. Each drop strikes the moss and returns to stillness.'
  },
  zen: {
    name: 'Cedar Sanctuary',
    subtitle: 'Warm Cedar Tatami • Vintage 70s Hi-Fi Meditation',
    bgGradient: 'from-[#1c140d] via-[#241a10] to-[#120c07]',
    lanternColor: '#cb997e',
    accentColor: '#ddbea9',
    textColor: '#fdf0d5',
    borderColor: 'rgba(203, 153, 126, 0.25)',
    quote: 'In deep stillness, the mind settles like clear water in a tranquil grove.'
  },
  starlight: {
    name: 'Cosmic Starlight',
    subtitle: 'Night Sky Nirvana • Deep Void & Astral Chimes',
    bgGradient: 'from-[#0b0c16] via-[#101222] to-[#05060b]',
    lanternColor: '#9d4edd',
    accentColor: '#c77dff',
    textColor: '#f3e8ff',
    borderColor: 'rgba(157, 78, 221, 0.25)',
    quote: 'In the vast darkness of space, consciousness is the only light.'
  }
};
