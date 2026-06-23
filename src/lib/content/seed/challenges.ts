import type { Challenge } from '../types';

/**
 * Live festival challenges — dated, countdown-driven programs that surface as
 * their festival nears (the highest-retention mechanic in the category). Each
 * is anchored to a festival in the calendar; the panchang resolves its dates
 * per timezone. They reuse JourneyDay and the journey progress store.
 *
 * All days reference real track ids in the catalog (checked by content:check).
 */

// 21 short daily focuses for the Hanuman Chalisa challenge.
const HANUMAN_FOCUS = [
  'I begin. One Chalisa, with attention.',
  'I offer my fear to Hanuman and ask for courage.',
  'I serve someone today, expecting nothing back.',
  'I steady my breath and my mind.',
  'I let go of a grudge I have been carrying.',
  'I act with honesty, even when it is hard.',
  'I give my worry about the result to Rama.',
  'I speak kindly, especially to those closest to me.',
  'I do the difficult task I have been avoiding.',
  'I notice my strength returning.',
  'I am patient with my own slow progress.',
  'I protect and uplift, never belittle.',
  'I read every line as if I mean it.',
  'I forgive myself for a past mistake.',
  'I choose devotion over distraction.',
  'I help without being asked.',
  'I keep my word today.',
  'I face what I have been afraid of.',
  'I am humble in strength, like Hanuman before Rama.',
  'I dedicate my practice to someone who needs it.',
  'On Hanuman Jayanti, I bow with a full heart.',
];

export const CHALLENGES: Challenge[] = [
  {
    id: 'navratri-nine-nights',
    title: 'Navratri — Nine Nights with the Goddess',
    subtitle: '9 days · the Navadurga',
    description:
      'Nine nights, nine forms of the Mother. Each day honours one form of Durga with her aarti and an intention — a guided way to keep the whole festival, wherever you are.',
    deityId: 'durga',
    colors: ['#9E2B25', '#E8772E'],
    festivalId: 'navratri',
    festivalDayIndex: 0,
    isFree: true,
    days: [
      { title: 'Shailaputri — the mountain', intention: 'I begin Navratri rooted and steady as the mountain.', trackIds: ['ambe-tu-hai-jagdambe'] },
      { title: 'Brahmacharini — devotion', intention: 'I walk the path with patience and devotion.', trackIds: ['ambe-tu-hai-jagdambe'] },
      { title: 'Chandraghanta — courage', intention: 'I meet the day with calm courage.', trackIds: ['durga-chalisa'] },
      { title: 'Kushmanda — the radiant', intention: 'I let warmth and light flow through me.', trackIds: ['ambe-tu-hai-jagdambe'] },
      { title: 'Skandamata — the mother', intention: 'I nurture those around me as the Mother nurtures all.', trackIds: ['ambe-tu-hai-jagdambe'] },
      { title: 'Katyayani — the warrior', intention: 'I stand for what is right, gently and firmly.', trackIds: ['durga-chalisa'] },
      { title: 'Kalaratri — the fearless', intention: 'I release fear and the darkness I have carried.', trackIds: ['ambe-tu-hai-jagdambe'] },
      { title: 'Mahagauri — purity', intention: 'I forgive, and let my heart grow light.', trackIds: ['ambe-tu-hai-jagdambe'] },
      { title: 'Siddhidatri — fulfilment', intention: 'I give thanks; the Mother completes what I began.', trackIds: ['durga-chalisa', 'ambe-tu-hai-jagdambe'] },
    ],
  },
  {
    id: 'diwali-five-days',
    title: 'Diwali — Five Days of Light',
    subtitle: '5 days · Dhanteras to Bhai Dooj',
    description:
      'Keep all five days of Diwali with intention — from Dhanteras through Lakshmi Puja to Bhai Dooj. A little ritual and a verse each day to light the season.',
    deityId: 'lakshmi',
    colors: ['#C9A24B', '#E8772E'],
    festivalId: 'diwali',
    festivalDayIndex: 2,
    isFree: true,
    days: [
      { title: 'Dhanteras — welcome abundance', intention: 'I clean and ready my home for grace to enter.', trackIds: ['om-jai-lakshmi-mata'] },
      { title: 'Chhoti Diwali — clear the dark', intention: 'I let go of what is stale and light the first lamps.', trackIds: ['vakratunda-mahakaya'] },
      { title: 'Lakshmi Puja — the great night', intention: 'I invite Lakshmi and Ganesha into a bright, grateful home.', trackIds: ['om-jai-lakshmi-mata', 'vakratunda-mahakaya'] },
      { title: 'Govardhan Puja — gratitude', intention: 'I give thanks for what sustains me — food, earth, and hands.', trackIds: ['om-jai-lakshmi-mata'] },
      { title: 'Bhai Dooj — bonds', intention: 'I honour my family and the bonds that protect us.', trackIds: ['om-jai-lakshmi-mata'] },
    ],
  },
  {
    id: 'hanuman-chalisa-21',
    title: '21 Days of the Hanuman Chalisa',
    subtitle: '21 days · to Hanuman Jayanti',
    description:
      'Build the habit that countless devotees swear by: the Hanuman Chalisa, every day for three weeks, arriving on Hanuman Jayanti. One focus a day, from fear to fearlessness.',
    deityId: 'hanuman',
    colors: ['#E8772E', '#9E2B25'],
    festivalId: 'hanuman-jayanti',
    festivalDayIndex: 20,
    isFree: true,
    days: HANUMAN_FOCUS.map((intention, i) => ({
      title: `Day ${i + 1}`,
      intention,
      trackIds: ['hanuman-chalisa'],
    })),
  },
  {
    id: 'guru-purnima-seven',
    title: 'Seven Days to the Guru',
    subtitle: '7 days · to Guru Purnima',
    description:
      'A quiet week of gratitude leading to Guru Purnima — for every teacher who has shaped you. Each day pairs a short practice with a reflection on what you have learned.',
    colors: ['#C75B17', '#6E1B18'],
    festivalId: 'guru-purnima',
    festivalDayIndex: 6,
    isFree: true,
    days: [
      { title: 'Remember', intention: 'I bring to mind the teachers who shaped me.', trackIds: ['morning-stillness'] },
      { title: 'Gratitude', intention: 'I give silent thanks to one teacher today.', trackIds: ['gayatri-mantra'] },
      { title: 'Listen', intention: 'I listen more than I speak today.', trackIds: ['morning-stillness'] },
      { title: 'Study', intention: 'I learn one thing deeply, not many things lightly.', trackIds: ['gayatri-mantra'] },
      { title: 'Adi Guru', intention: 'I honour Shiva, the first teacher, and the stillness he holds.', trackIds: ['om-namah-shivaya'] },
      { title: 'Pass it on', intention: 'I teach or help someone, freely.', trackIds: ['morning-stillness'] },
      { title: 'Guru Purnima', intention: 'I bow to all who have guided me, and dedicate my practice to them.', trackIds: ['gayatri-mantra', 'morning-stillness'] },
    ],
  },
];
