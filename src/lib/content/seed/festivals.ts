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
    homeCelebration: {
      needs: ['Diyas or candles', 'A Lakshmi/Ganesha image', 'Flowers', 'Sweets', 'Incense'],
      steps: [
        'Clean and tidy your home — Lakshmi enters where it is clean and bright.',
        'Make a small rangoli at your entrance with rice flour or coloured powder.',
        'At dusk, light a row of diyas at the doorway and windows.',
        'Set Lakshmi and Ganesha on a clean cloth; offer flowers, sweets and incense.',
        'Play or sing the Lakshmi aarti together as a family.',
        'Share sweets and call loved ones back home.',
      ],
    },
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
    homeCelebration: {
      needs: ['Dry/organic gulal', 'Old clothes', 'Sweets (gujiya)', 'A candle for Holika'],
      steps: [
        'The night before, gather for Holika Dahan — light a small fire (or a candle) and let go of negativity.',
        'Next morning, play with colours with family and friends — gently, and with consent.',
        'Make or buy festive sweets like gujiya and thandai.',
        'Sing Krishna–Radha bhajans and dance together.',
        'Wash up, then visit or video-call relatives to exchange wishes.',
      ],
    },
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
    homeCelebration: {
      needs: ['An eco-friendly clay Ganesha murti', 'Modak or laddoo', 'Durva grass & red flowers', 'Incense & a diya'],
      steps: [
        'Install the Ganesha murti on a decorated platform with a clean cloth.',
        'Invoke Ganesha and offer durva grass, flowers and modak.',
        'Perform aarti morning and evening for as many days as you keep him (1½, 5, 7 or 10).',
        'On the last day, immerse a clay murti in a bucket or tank at home and reuse the soil for a plant.',
        'Pray “Ganpati Bappa Morya — come again soon.”',
      ],
    },
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
    homeCelebration: {
      needs: ['A Bal Gopal (baby Krishna) image', 'A small cradle (jhula)', 'Butter, milk & sweets', 'A peacock feather'],
      steps: [
        'Decorate a small jhula (cradle) for baby Krishna.',
        'Keep a light fast through the day if you wish.',
        'At midnight — Krishna’s birth hour — bathe the murti with milk, dress him and place him in the jhula.',
        'Offer makhan-mishri and sweets; rock the cradle and sing bhajans.',
        'Perform aarti and break your fast with prasad.',
      ],
    },
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
    homeCelebration: {
      needs: ['A Durga/Devi image', 'A kalash (pot) with water & coconut', 'Red flowers & chunri', 'A diya for the akhand jyoti'],
      steps: [
        'On day one, set up a kalash, install the Devi, and light a diya to burn through the nine days.',
        'Each day, offer flowers and recite or play a Durga aarti.',
        'Keep a fast (fruit or sabudana) on the days you are able.',
        'On Ashtami/Navami do Kanya Puja — feed and honour young girls as forms of the Goddess.',
        'On the tenth day (Vijayadashami), thank the Mother and celebrate good over evil.',
      ],
    },
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
    homeCelebration: {
      needs: ['A Rama (or Rama-Sita) image', 'Tulsi leaves & flowers', 'Sweet rice or panakam', 'A diya'],
      steps: [
        'Clean your altar and place Rama with Sita, Lakshmana and Hanuman if you have them.',
        'Read or play a passage of the Ramayana / Sundarkand.',
        'Keep a light fast until noon — Rama’s birth hour.',
        'At midday, offer flowers, tulsi and sweets, and perform aarti.',
        'Share prasad and reflect on Rama’s ideals of duty and truth.',
      ],
    },
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
    homeCelebration: {
      needs: ['A Hanuman image', 'Sindoor & a little oil', 'Boondi laddoo', 'A diya & incense'],
      steps: [
        'Wake early, bathe, and sit before Hanuman’s image.',
        'Offer sindoor mixed with a little oil, flowers and a diya.',
        'Recite the Hanuman Chalisa — ideally several times — and Sundarkand if you can.',
        'Offer boondi laddoo and share it as prasad.',
        'Ask Hanuman for strength, courage and protection for your home.',
      ],
    },
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
    homeCelebration: {
      needs: ['A Shiva lingam or image', 'Water, milk & honey', 'Bilva (bel) leaves', 'A diya'],
      steps: [
        'Keep a fast through the day (fruit or water as you’re able).',
        'Bathe the lingam with water, then milk and honey, chanting “Om Namah Shivaya.”',
        'Offer bilva leaves, which Shiva loves.',
        'Stay up for the night vigil — chant and meditate in watches if you can.',
        'Break the fast the next morning with prasad.',
      ],
    },
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
    homeCelebration: {
      needs: ['Til (sesame) & jaggery sweets', 'A bowl of water for arghya', 'An optional kite'],
      steps: [
        'At sunrise, offer water (arghya) to the Sun while facing east.',
        'Share til-gud sweets with the words “speak sweetly, stay close.”',
        'If you can, take a simple bath before prayers.',
        'Fly kites or step outside to greet the lengthening days.',
        'Give a small donation (daan) — a core spirit of the day.',
      ],
    },
  },
  {
    id: 'guru-purnima',
    name: 'Guru Purnima',
    devanagari: 'गुरु पूर्णिमा',
    kind: 'major',
    description: 'A day to honor one\'s spiritual and academic teachers, observed on the full moon of Ashadha.',
    rule: { type: 'tithi', month: 4, paksha: 'shukla', tithi: 15 },
    observances: ['Honor the guru', 'Meditation', 'Study scripture'],
    homeCelebration: {
      needs: ['A photo of your guru/teacher', 'Flowers', 'A diya', 'A notebook'],
      steps: [
        'Sit quietly and bring your teachers — spiritual and worldly — to mind with gratitude.',
        'Offer flowers and light a diya before your guru’s image or a sacred book.',
        'Read or listen to a teaching and write down one lesson to live by.',
        'Reach out to a mentor to say thank you.',
        'Meditate, dedicating the merit to all who have guided you.',
      ],
    },
  },
];
