import type { Journey } from '../types';

/**
 * Guided multi-day journeys — the retention engine. Each day pairs short
 * practices with an intention (sankalpa) and an optional verse. All days
 * reference real track ids in the catalog.
 */
export const JOURNEYS: Journey[] = [
  {
    id: 'begin-with-ganesha',
    title: 'Begin with Ganesha',
    subtitle: '3 days · for new beginnings',
    description:
      'Open any new chapter — a move, a job, a baby, a fresh start — by invoking the remover of obstacles. Three short days to clear the path and steady the mind.',
    deityId: 'ganesha',
    colors: ['#F4A300', '#E8772E'],
    isFree: true,
    days: [
      {
        title: 'Clear the path',
        intention: 'I set down what blocks me and ask for a clear beginning.',
        trackIds: ['vakratunda-mahakaya'],
        verse: { scriptureId: 'bhagavad-gita', chapter: 2, ref: '2.47' },
      },
      {
        title: 'Offer the light',
        intention: 'I offer this small light and my full attention.',
        trackIds: ['jai-ganesh-deva'],
      },
      {
        title: 'Begin the work',
        intention: 'I begin, steady and unattached to the result.',
        trackIds: ['vakratunda-mahakaya', 'jai-ganesh-deva'],
        verse: { scriptureId: 'bhagavad-gita', chapter: 2, ref: '2.48' },
      },
    ],
  },
  {
    id: 'seven-days-hanuman',
    title: 'Seven Days with Hanuman',
    subtitle: '7 days · courage & service',
    description:
      'A week of the Hanuman Chalisa, one focus each day — from fear to fearlessness, from doubt to devotion. Build the habit and feel your strength return.',
    deityId: 'hanuman',
    colors: ['#E8772E', '#9E2B25'],
    isFree: true,
    days: [
      { title: 'Begin', intention: 'I show up, exactly as I am.', trackIds: ['hanuman-chalisa'] },
      { title: 'Steadiness', intention: 'I meet today with a calm, strong heart.', trackIds: ['hanuman-chalisa', 'om-namah-shivaya'] },
      { title: 'Clarity', intention: 'May my mind be bright and my purpose clear.', trackIds: ['hanuman-chalisa', 'gayatri-mantra'] },
      { title: 'Joy', intention: 'I serve with gladness, not grievance.', trackIds: ['hanuman-chalisa', 'hare-krishna-maha-mantra'] },
      { title: 'Courage', intention: 'I do the hard, right thing today.', trackIds: ['hanuman-chalisa'], verse: { scriptureId: 'bhagavad-gita', chapter: 2, ref: '2.20' } },
      { title: 'Surrender', intention: 'I offer the outcome and keep walking.', trackIds: ['hanuman-chalisa', 'om-jai-jagdish-hare'] },
      { title: 'Devotion', intention: 'Let Rama dwell where my fear once lived.', trackIds: ['hanuman-chalisa'], verse: { scriptureId: 'bhagavad-gita', chapter: 2, ref: '2.47' } },
    ],
  },
  {
    id: 'the-light-within',
    title: 'The Light Within',
    subtitle: '5 days · stillness & breath',
    description:
      'A gentle introduction to meditation, rooted in mantra and breath. Five mornings to find the quiet temple that is always within you.',
    deityId: 'shiva',
    colors: ['#5B6E8A', '#36506E'],
    isFree: true,
    days: [
      { title: 'Arrive', intention: 'For five minutes, there is nowhere else to be.', trackIds: ['morning-stillness'] },
      { title: 'The mantra', intention: 'I let the mantra carry the mind home.', trackIds: ['om-namah-shivaya'] },
      { title: 'The breath', intention: 'I rest in the space between two breaths.', trackIds: ['morning-stillness', 'gayatri-mantra'] },
      { title: 'Stillness', intention: 'I let thoughts pass like clouds.', trackIds: ['om-namah-shivaya'] },
      { title: 'The witness', intention: 'I am the quiet that watches it all.', trackIds: ['morning-stillness'], verse: { scriptureId: 'bhagavad-gita', chapter: 2, ref: '2.62' } },
    ],
  },
];
