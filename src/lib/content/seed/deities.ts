import type { Deity } from '../types';

/**
 * Seed pantheon. Broadly pan-Hindu (Sanatani) so the app does not privilege one
 * sampradaya. Descriptions are concise and reverent; expand/verify with named
 * acharya sources before production.
 */
export const DEITIES: Deity[] = [
  {
    id: 'ganesha',
    name: 'Ganesha',
    devanagari: 'गणेश',
    epithet: 'Remover of Obstacles',
    tradition: 'ganapatya',
    description:
      'The elephant-headed son of Shiva and Parvati, invoked first before any undertaking as Vighnaharta — the remover of obstacles and lord of beginnings and wisdom.',
    auspiciousDays: [3], // Wednesday
    colors: ['#F4A300', '#E8772E'],
    glyph: '🕉️',
    mantraSeed: 'गं',
  },
  {
    id: 'hanuman',
    name: 'Hanuman',
    devanagari: 'हनुमान',
    epithet: 'The Devoted, The Mighty',
    tradition: 'vaishnava',
    description:
      'The vanara devotee of Sri Rama, embodiment of strength, courage, selfless service and unwavering bhakti. Worshipped especially on Tuesdays and Saturdays.',
    auspiciousDays: [2, 6], // Tue, Sat
    colors: ['#E8772E', '#9E2B25'],
    glyph: '🙏',
    mantraSeed: 'राम',
  },
  {
    id: 'krishna',
    name: 'Krishna',
    devanagari: 'कृष्ण',
    epithet: 'The All-Attractive One',
    tradition: 'vaishnava',
    description:
      'The eighth avatara of Vishnu, speaker of the Bhagavad Gita, the playful cowherd of Vrindavan and the supreme teacher of dharma, love and surrender.',
    auspiciousDays: [3],
    colors: ['#3C6E9E', '#5B4B9E'],
    glyph: '🪈',
    mantraSeed: 'क्लीं',
  },
  {
    id: 'rama',
    name: 'Rama',
    devanagari: 'राम',
    epithet: 'Maryada Purushottama',
    tradition: 'vaishnava',
    description:
      'The seventh avatara of Vishnu, the ideal king and embodiment of dharma whose life is told in the Ramayana — righteousness, duty and devotion personified.',
    auspiciousDays: [4],
    colors: ['#4C8A5A', '#2F6E45'],
    glyph: '🏹',
    mantraSeed: 'राम',
  },
  {
    id: 'shiva',
    name: 'Shiva',
    devanagari: 'शिव',
    epithet: 'The Auspicious One',
    tradition: 'shaiva',
    description:
      'Mahadeva, the great ascetic and lord of meditation, time and transformation. The still point of the cosmos, worshipped as the Linga and as Nataraja, lord of the cosmic dance.',
    auspiciousDays: [1], // Monday
    colors: ['#5B6E8A', '#36506E'],
    glyph: '🔱',
    mantraSeed: 'नमः शिवाय',
  },
  {
    id: 'durga',
    name: 'Durga',
    devanagari: 'दुर्गा',
    epithet: 'The Invincible Mother',
    tradition: 'shakta',
    description:
      'The fierce and compassionate Mother Goddess, slayer of Mahishasura, the embodiment of Shakti — the divine feminine power that protects dharma and her devotees.',
    auspiciousDays: [5],
    colors: ['#C0392B', '#9E2B25'],
    glyph: '🌺',
    mantraSeed: 'दुं',
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi',
    devanagari: 'लक्ष्मी',
    epithet: 'Bestower of Abundance',
    tradition: 'vaishnava',
    description:
      'Consort of Vishnu and goddess of wealth, fortune, beauty and prosperity — both material and spiritual. Worshipped especially at Diwali.',
    auspiciousDays: [5], // Friday
    colors: ['#E4C77E', '#C9A24B'],
    glyph: '🪷',
    mantraSeed: 'श्रीं',
  },
  {
    id: 'saraswati',
    name: 'Saraswati',
    devanagari: 'सरस्वती',
    epithet: 'Goddess of Knowledge',
    tradition: 'smarta',
    description:
      'Goddess of wisdom, music, art and learning, seated on a white lotus with the veena. Invoked by students and seekers of all knowledge.',
    auspiciousDays: [3],
    colors: ['#EDE6D6', '#C9A24B'],
    glyph: '🎼',
    mantraSeed: 'ऐं',
  },
  {
    id: 'vishnu',
    name: 'Vishnu',
    devanagari: 'विष्णु',
    epithet: 'The Preserver',
    tradition: 'vaishnava',
    description:
      'The preserver and protector of the cosmos within the Trimurti, who descends across ages as the avataras to restore dharma. Worshipped as Narayana.',
    auspiciousDays: [4], // Thursday
    colors: ['#3C6E9E', '#2A4E7E'],
    glyph: '🐚',
    mantraSeed: 'ॐ',
  },
  {
    id: 'surya',
    name: 'Surya',
    devanagari: 'सूर्य',
    epithet: 'The Radiant Sun',
    tradition: 'smarta',
    description:
      'The visible divinity, the sun who sustains all life. The Gayatri mantra is addressed to the solar light of consciousness. Honored at dawn with Surya Namaskar.',
    auspiciousDays: [0], // Sunday
    colors: ['#F4A300', '#E8772E'],
    glyph: '☀️',
    mantraSeed: 'ॐ सूर्याय',
  },
];

export const DEITY_BY_ID: Record<string, Deity> = Object.fromEntries(
  DEITIES.map((d) => [d.id, d]),
);
