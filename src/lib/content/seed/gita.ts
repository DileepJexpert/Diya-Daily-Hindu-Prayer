import type { Scripture } from '../types';

/**
 * Bhagavad Gita — seed selection. The text is public domain; transliteration is
 * IAST-leaning and translations are faithful plain-English renderings authored
 * for Diya (to avoid copyright on specific translators). Mark for scholarly
 * review before production. A fuller chapter set is loaded alongside this seed.
 */
export const BHAGAVAD_GITA: Scripture = {
  id: 'bhagavad-gita',
  title: 'Bhagavad Gita',
  devanagari: 'श्रीमद्भगवद्गीता',
  subtitle: 'The Song of the Lord',
  description:
    "Krishna's counsel to Arjuna on the battlefield of Kurukshetra — 700 verses on duty, devotion, action and the nature of the Self, set within the Mahabharata.",
  attribution: 'Vyasa · Diya plain-English rendering (pending scholarly review)',
  chapters: [
    {
      number: 2,
      title: 'Sankhya Yoga — The Yoga of Knowledge',
      devanagari: 'सांख्ययोग',
      summary:
        'Krishna begins his teaching: the Self is eternal and indestructible; act according to your dharma without attachment to results.',
      verses: [
        {
          ref: '2.13',
          devanagari:
            'देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा।\nतथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति॥',
          transliteration:
            'dehino ’smin yathā dehe kaumāraṁ yauvanaṁ jarā\ntathā dehāntara-prāptir dhīras tatra na muhyati',
          translation:
            'As the embodied soul passes through childhood, youth and old age in this body, so too it passes into another body at death. The wise are not deluded by this.',
        },
        {
          ref: '2.20',
          devanagari:
            'न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे॥',
          transliteration:
            'na jāyate mriyate vā kadācin\nnāyaṁ bhūtvā bhavitā vā na bhūyaḥ\najo nityaḥ śāśvato ’yaṁ purāṇo\nna hanyate hanyamāne śarīre',
          translation:
            'The Self is never born and never dies; it has not come into being and will not cease to be. Unborn, eternal, ever-existing and ancient, it is not slain when the body is slain.',
        },
        {
          ref: '2.47',
          devanagari:
            'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
          transliteration:
            'karmaṇy evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo ’stv akarmaṇi',
          translation:
            'You have a right to your action alone, never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.',
          commentary:
            'The most quoted verse of the Gita — nishkama karma, action without craving for the reward.',
        },
        {
          ref: '2.48',
          devanagari:
            'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥',
          transliteration:
            'yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate',
          translation:
            'Established in yoga, perform your actions abandoning attachment, even-minded in success and failure, Arjuna. This evenness of mind is called yoga.',
        },
        {
          ref: '2.62',
          devanagari:
            'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥',
          transliteration:
            'dhyāyato viṣayān puṁsaḥ saṅgas teṣūpajāyate\nsaṅgāt sañjāyate kāmaḥ kāmāt krodho ’bhijāyate',
          translation:
            'Dwelling on objects of the senses, a person grows attached to them; from attachment springs desire, and from thwarted desire arises anger.',
        },
      ],
    },
  ],
};
