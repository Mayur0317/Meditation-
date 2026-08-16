export interface MeditationQuote {
  id: string;
  quote: string;
  author: string;
  source: string;
  focus: string; // e.g. 'Sound Bath', 'Inner Silence', 'Deep Breath', 'Mindfulness'
}

export const MEDITATION_QUOTES: MeditationQuote[] = [
  {
    id: 'quote-1',
    quote: 'Sound is the medicine of the future. When vibration touches the soul, stillness is born.',
    author: 'Edgar Cayce',
    source: 'Harmonic Healing',
    focus: 'Sound Bath & 432Hz'
  },
  {
    id: 'quote-2',
    quote: 'The singing bowl does not create sound; it awakens the silence that was already waiting inside you.',
    author: 'Tibetan Wisdom Tradition',
    source: 'Himalayan Teachings',
    focus: 'Singing Bowls'
  },
  {
    id: 'quote-3',
    quote: 'Silence is not the absence of sound, but the presence of an innocent awareness.',
    author: 'Anthony de Mello',
    source: 'The Way to Love',
    focus: 'Inner Stillness'
  },
  {
    id: 'quote-4',
    quote: 'In the resonance of the singing bowl, every cell in the body remembers its natural harmony.',
    author: 'Lama Tenzin Wangyal',
    source: 'Tibetan Sound Healing',
    focus: 'Vibrational Harmony'
  },
  {
    id: 'quote-5',
    quote: 'Feel your breath flowing in like a gentle mountain breeze, and flowing out like tranquil waters.',
    author: 'Thich Nhat Hanh',
    source: 'The Miracle of Mindfulness',
    focus: 'Mindful Breath'
  },
  {
    id: 'quote-6',
    quote: 'When the ripples of thought settle, the inner sun reflects clearly on the tranquil water.',
    author: 'Patanjali',
    source: 'Yoga Sutras',
    focus: 'Still Mind'
  },
  {
    id: 'quote-7',
    quote: 'Within you there is a stillness and a sanctuary to which you can retreat at any time and be yourself.',
    author: 'Hermann Hesse',
    source: 'Siddhartha',
    focus: 'Inner Sanctuary'
  },
  {
    id: 'quote-8',
    quote: 'Listen to the sound of the bell until it merges with the sound of the universe.',
    author: 'Zen Master Dogen',
    source: 'Shobogenzo',
    focus: 'Zen Awareness'
  },
  {
    id: 'quote-9',
    quote: 'Music and harmonic sound wash away from the soul the dust of everyday life.',
    author: 'Berthold Auerbach',
    source: 'Spiritual Resonance',
    focus: 'Soul Cleansing'
  },
  {
    id: 'quote-10',
    quote: 'Be still. Close your eyes. Let the sound vibrations dissolve all tension into boundless space.',
    author: 'Ramana Maharshi',
    source: 'Self-Inquiry Dialogue',
    focus: 'Pure Presence'
  }
];
