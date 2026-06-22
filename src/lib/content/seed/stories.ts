import type { Story } from '../types';

/**
 * Sacred stories (katha) retold simply for families — the "raise my kids Hindu"
 * wedge. Drawn from the Puranas and itihasa; retellings are original and
 * kid-appropriate. Mark for review by tradition-holders before production.
 */
export const STORIES: Story[] = [
  {
    id: 'ganesha-wins-the-world',
    title: 'Ganesha Wins the World',
    deityId: 'ganesha',
    ageGroup: 'kids',
    readingMinutes: 3,
    glyph: '🌍',
    summary: 'A race around the world, won not by speed but by love.',
    body: [
      'One day the sage Narada brought a single sweet, golden mango to Mount Kailash. “Whoever circles the whole world first,” said Shiva and Parvati, “will win this magical fruit.”',
      'Quick young Kartikeya leapt onto his peacock and sped off to fly around all the oceans and mountains. But round-bellied Ganesha just smiled. He walked slowly around his mother and father, once, and folded his hands.',
      '“My parents are my whole world,” said Ganesha. “To circle you is to circle everything.” Shiva and Parvati glowed with joy and gave him the mango.',
    ],
    moral: 'The people who love us are a whole world. Devotion sees what speed cannot.',
    attribution: 'Puranic katha · family retelling',
  },
  {
    id: 'hanuman-and-the-sun',
    title: 'Hanuman and the Sun',
    deityId: 'hanuman',
    ageGroup: 'kids',
    readingMinutes: 3,
    glyph: '☀️',
    summary: 'A hungry little hero mistakes the sun for a ripe fruit.',
    body: [
      'When Hanuman was a baby, he was always hungry and never afraid. One morning he saw the sun rising — round, golden and glowing — and thought it was the sweetest mango in the sky.',
      'With one mighty leap the child shot up through the clouds, reaching for the sun itself! The whole heavens were amazed at such strength and such fearless love.',
      'The gods gently guided him home, and blessed him with gifts beyond counting. That tiny leaper would grow into the greatest of devotees, strong enough to cross oceans for Sri Rama.',
    ],
    moral: 'Great strength begins small — and is gentlest when it serves.',
    attribution: 'Ramayana katha · family retelling',
  },
  {
    id: 'krishna-lifts-govardhan',
    title: 'Krishna Lifts the Mountain',
    deityId: 'krishna',
    ageGroup: 'all',
    readingMinutes: 4,
    glyph: '⛰️',
    summary: 'A boy shelters his whole village beneath a hill.',
    body: [
      'The people of Vrindavan once worshipped Indra, lord of rain, fearing his storms. But young Krishna said, “Let us instead thank Govardhan Hill, who gives our cows grass and our families shade.”',
      'Indra grew angry and sent a flood of rain to drown the village. Rivers rose and children cried. Then Krishna bent down, lifted the entire Govardhan Hill on the tip of his little finger, and held it up like a great umbrella.',
      'For seven days the villagers and their cows sheltered safe and dry beneath the hill. At last Indra understood his pride, and bowed before the smiling cowherd boy.',
    ],
    moral: 'True power protects the small and humbles the proud.',
    attribution: 'Bhagavata Purana · family retelling',
  },
  {
    id: 'prahlada-and-the-fire',
    title: 'Prahlada and the Fire',
    deityId: 'vishnu',
    ageGroup: 'all',
    readingMinutes: 4,
    glyph: '🔥',
    summary: 'Why we light the Holika bonfire before Holi.',
    body: [
      'Long ago a proud king forbade everyone to worship anyone but himself. Yet his own son, little Prahlada, kept singing the name of Vishnu, sweetly and without fear.',
      'The angry king asked his sister Holika — who could not be burned by fire — to sit in a great blaze holding the boy. But as the flames roared, it was Prahlada who stayed safe, protected by his faith, while the cruelty turned to ash.',
      'That is why, the night before Holi, families light the Holika bonfire — to remember that love and truth shine on, long after fear burns away.',
    ],
    moral: 'Faith kept gently and bravely cannot be burned.',
    attribution: 'Bhagavata Purana · family retelling',
  },
  {
    id: 'dhruva-the-steady-star',
    title: 'Dhruva, the Steady Star',
    deityId: 'vishnu',
    ageGroup: 'all',
    readingMinutes: 4,
    glyph: '⭐',
    summary: 'A small boy becomes the still point of the night sky.',
    body: [
      'A young prince named Dhruva was once told he was too small to sit on his father’s lap. Hurt but determined, he walked into the forest to find something that could never be taken away.',
      'There he sat in deep meditation, calling on Vishnu with all his heart — through cold and heat, day and night, unmoving. His longing was so pure that the Lord himself appeared before him.',
      'Vishnu blessed the boy with a place that would never waver: the Pole Star, around which all the other stars turn. To this day, Dhruva shines steady in the north, guiding travelers home.',
    ],
    moral: 'A steady heart becomes a light for others to steer by.',
    attribution: 'Vishnu Purana · family retelling',
  },
];
