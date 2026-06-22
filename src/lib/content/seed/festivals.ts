import type { Festival } from '../types';

/**
 * Festival calendar. Lunisolar festivals use a `tithi` rule resolved by the
 * panchang engine for the user's timezone; fixed-date ones use `gregorian`.
 * Months for tithi rules use the Hindu lunar month index (1=Chaitra ...).
 */
export const FESTIVALS: Festival[] = [
  {
    id: 'diwali',
    name: 'Diwali',
    devanagari: 'दीवाली',
    kind: 'major',
    deityId: 'lakshmi',
    description:
      'The festival of lights celebrating the victory of light over darkness. Homes are lit with diyas and Lakshmi is invoked for prosperity.',
    rule: { type: 'tithi', month: 7, paksha: 'krishna', tithi: 15 }, // Kartika Amavasya
    significance: 'Return of Sri Rama to Ayodhya; worship of Lakshmi.',
    observances: ['Light diyas at dusk', 'Lakshmi puja', 'Rangoli', 'Share sweets'],
  },
  {
    id: 'holi',
    name: 'Holi',
    devanagari: 'होली',
    kind: 'major',
    deityId: 'krishna',
    description:
      'The festival of colors marking the arrival of spring and the love of Radha and Krishna; preceded by Holika Dahan.',
    rule: { type: 'tithi', month: 12, paksha: 'shukla', tithi: 15 }, // Phalguna Purnima
    observances: ['Holika bonfire', 'Play with colors', 'Visit family'],
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    devanagari: 'गणेश चतुर्थी',
    kind: 'major',
    deityId: 'ganesha',
    description:
      'The birthday of Ganesha, welcomed into homes and pandals for ten days and lovingly immersed on Anant Chaturdashi.',
    rule: { type: 'tithi', month: 6, paksha: 'shukla', tithi: 4 }, // Bhadrapada Shukla Chaturthi
    observances: ['Install Ganesha murti', 'Modak offering', 'Daily aarti', 'Visarjan'],
  },
  {
    id: 'janmashtami',
    name: 'Krishna Janmashtami',
    devanagari: 'जन्माष्टमी',
    kind: 'jayanti',
    deityId: 'krishna',
    description:
      "Celebration of Krishna's birth at midnight, observed with fasting, bhajans, jhula and the Dahi Handi.",
    rule: { type: 'tithi', month: 5, paksha: 'krishna', tithi: 8 }, // Bhadrapada Krishna Ashtami
    observances: ['Fast until midnight', 'Midnight aarti', 'Decorate jhula'],
  },
  {
    id: 'navratri',
    name: 'Sharad Navratri',
    devanagari: 'नवरात्रि',
    kind: 'major',
    deityId: 'durga',
    description:
      'Nine nights honoring the nine forms of the Mother Goddess, culminating in Vijayadashami — the triumph of good over evil.',
    rule: { type: 'tithi', month: 7, paksha: 'shukla', tithi: 1 }, // Ashwina Shukla Pratipada
    observances: ['Fast', 'Garba & Dandiya', 'Kanya puja', 'Durga aarti'],
  },
  {
    id: 'ram-navami',
    name: 'Rama Navami',
    devanagari: 'राम नवमी',
    kind: 'jayanti',
    deityId: 'rama',
    description: "The birth of Sri Rama, observed with Ramayana recitation, fasting and bhajans.",
    rule: { type: 'tithi', month: 1, paksha: 'shukla', tithi: 9 }, // Chaitra Shukla Navami
    observances: ['Ramayana path', 'Fast', 'Temple darshan'],
  },
  {
    id: 'hanuman-jayanti',
    name: 'Hanuman Jayanti',
    devanagari: 'हनुमान जयंती',
    kind: 'jayanti',
    deityId: 'hanuman',
    description: 'The appearance day of Hanuman, celebrated with Chalisa recitation and Sundarkand path.',
    rule: { type: 'tithi', month: 1, paksha: 'shukla', tithi: 15 }, // Chaitra Purnima
    observances: ['Hanuman Chalisa', 'Sundarkand path', 'Sindoor offering'],
  },
  {
    id: 'maha-shivaratri',
    name: 'Maha Shivaratri',
    devanagari: 'महाशिवरात्रि',
    kind: 'major',
    deityId: 'shiva',
    description:
      'The great night of Shiva, observed with night-long vigil, fasting, abhishekam and chanting of Om Namah Shivaya.',
    rule: { type: 'tithi', month: 11, paksha: 'krishna', tithi: 14 }, // Magha Krishna Chaturdashi
    observances: ['Night vigil', 'Rudrabhishekam', 'Fast', 'Bilva leaves'],
  },
  {
    id: 'makar-sankranti',
    name: 'Makar Sankranti',
    devanagari: 'मकर संक्रांति',
    kind: 'major',
    deityId: 'surya',
    description:
      "Marks the sun's transition into Capricorn and the start of its northward journey; celebrated with kites, til-gud and holy dips.",
    rule: { type: 'gregorian', month: 1, day: 14 },
    observances: ['Holy dip', 'Til-gud sweets', 'Kite flying', 'Surya arghya'],
  },
  {
    id: 'guru-purnima',
    name: 'Guru Purnima',
    devanagari: 'गुरु पूर्णिमा',
    kind: 'major',
    description: 'A day to honor one\'s spiritual and academic teachers, observed on the full moon of Ashadha.',
    rule: { type: 'tithi', month: 4, paksha: 'shukla', tithi: 15 },
    observances: ['Honor the guru', 'Meditation', 'Study scripture'],
  },
];
