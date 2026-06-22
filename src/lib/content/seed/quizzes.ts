import type { QuizQuestion } from '../types';

/** Gentle comprehension quizzes for the family stories. Keyed by story id. */
export const STORY_QUIZZES: Record<string, QuizQuestion[]> = {
  'ganesha-wins-the-world': [
    { q: 'How did Ganesha win the race?', options: ['He flew around the world', 'He walked around his parents', 'He rode a peacock', 'He climbed a mountain'], answer: 1 },
    { q: 'What was the prize?', options: ['A crown', 'A golden mango', 'A drum', 'A bow'], answer: 1 },
    { q: 'What did Ganesha call his whole world?', options: ['The ocean', 'His parents', 'The sky', 'His mouse'], answer: 1 },
  ],
  'hanuman-and-the-sun': [
    { q: 'What did baby Hanuman think the sun was?', options: ['A ball', 'A ripe mango', 'A lamp', 'A coin'], answer: 1 },
    { q: 'What did he do when he saw it?', options: ['Cried', 'Leapt up to reach it', 'Ran away', 'Fell asleep'], answer: 1 },
    { q: 'Whom would Hanuman grow up to serve?', options: ['Krishna', 'Sri Rama', 'Indra', 'Brahma'], answer: 1 },
  ],
  'krishna-lifts-govardhan': [
    { q: 'Whom did the villagers fear at first?', options: ['Indra', 'Agni', 'Varuna', 'Yama'], answer: 0 },
    { q: 'What did Krishna lift?', options: ['A river', 'Govardhan Hill', 'A great tree', 'A chariot'], answer: 1 },
    { q: 'On what did he balance the hill?', options: ['His head', 'His little finger', 'His shoulder', 'A staff'], answer: 1 },
  ],
  'prahlada-and-the-fire': [
    { q: 'Whose name did Prahlada sing?', options: ['Shiva', 'Vishnu', 'Brahma', 'Indra'], answer: 1 },
    { q: 'Which festival remembers this with a bonfire?', options: ['Diwali', 'Holi', 'Navratri', 'Onam'], answer: 1 },
  ],
  'dhruva-the-steady-star': [
    { q: 'What did Dhruva want that could never be taken away?', options: ['Gold', 'A steady place of his own', 'A toy', 'A horse'], answer: 1 },
    { q: 'What did Dhruva become?', options: ['The moon', 'The Pole Star', 'A river', 'A mountain'], answer: 1 },
  ],
};
