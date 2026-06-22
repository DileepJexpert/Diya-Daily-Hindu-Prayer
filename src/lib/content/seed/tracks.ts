import type { Track } from '../types';

/**
 * Devotional audio tracks with time-synced lyrics.
 *
 * IMPORTANT: `audio` is null for every seed track — Diya does not ship
 * copyrighted recordings. The player renders the synced-lyric experience using
 * the `t` timings (a paced "follow-along" scroll) so the flagship feature is
 * fully demonstrable. In production, set `audio` to a licensed/commissioned
 * recording (remote CDN uri or bundled require) and keep the same timings.
 *
 * Text is traditional/public-domain. Transliteration is phonetic (IAST-leaning)
 * and translations are faithful plain-English renderings authored for Diya.
 * Flag all sacred text for scholarly verification before production.
 */

const hanumanChalisa: Track = {
  id: 'hanuman-chalisa',
  title: 'Hanuman Chalisa',
  devanagari: 'हनुमान चालीसा',
  kind: 'chalisa',
  deityId: 'hanuman',
  language: 'hi',
  artist: 'Traditional · Tulsidas',
  duration: 168,
  audio: null,
  isFree: true,
  previewSeconds: 60,
  attribution: 'Goswami Tulsidas (16th c.) · public domain',
  tags: ['tuesday', 'saturday', 'strength', 'protection'],
  lyrics: [
    {
      t: 0,
      section: 'Doha',
      devanagari: 'श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।',
      transliteration: 'shrī guru charana saroja raja, nija manu mukuru sudhāri',
      translation:
        "Cleansing the mirror of my mind with the dust of my Guru's lotus feet,",
    },
    {
      t: 8,
      section: 'Doha',
      devanagari: 'बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि॥',
      transliteration: 'baranau raghubara bimala jasu, jo dāyaku phala chāri',
      translation: 'I sing the pure glory of Sri Rama, who bestows the four fruits of life.',
    },
    {
      t: 16,
      section: 'Doha',
      devanagari: 'बुद्धिहीन तनु जानिके, सुमिरौं पवनकुमार।',
      transliteration: 'buddhihīna tanu jānike, sumirau pavana-kumāra',
      translation: 'Knowing my body to be devoid of wit, I remember you, son of the Wind.',
    },
    {
      t: 24,
      section: 'Doha',
      devanagari: 'बल बुधि बिद्या देहु मोहिं, हरहु कलेस बिकार॥',
      transliteration: 'bala budhi bidyā dehu mohi, harahu kalesa bikāra',
      translation: 'Grant me strength, wisdom and knowledge, and remove my afflictions.',
    },
    {
      t: 32,
      section: 'Chaupai',
      devanagari: 'जय हनुमान ज्ञान गुन सागर। जय कपीस तिहुँ लोक उजागर॥',
      transliteration: 'jaya hanumāna jñāna guna sāgara, jaya kapīsa tihu loka ujāgara',
      translation:
        'Victory to Hanuman, ocean of wisdom and virtue; victory to the lord of vanaras who lights the three worlds.',
    },
    {
      t: 40,
      section: 'Chaupai',
      devanagari: 'राम दूत अतुलित बल धामा। अंजनि पुत्र पवनसुत नामा॥',
      transliteration: 'rāma dūta atulita bala dhāmā, anjani putra pavanasuta nāmā',
      translation:
        'Messenger of Rama, abode of matchless strength, known as son of Anjani and child of the Wind.',
    },
    {
      t: 48,
      section: 'Chaupai',
      devanagari: 'महाबीर बिक्रम बजरंगी। कुमति निवार सुमति के संगी॥',
      transliteration: 'mahābīra bikrama bajarangī, kumati nivāra sumati ke sangī',
      translation:
        'Great hero, mighty as a thunderbolt, remover of base thoughts and companion of the wise.',
    },
    {
      t: 56,
      section: 'Chaupai',
      devanagari: 'कंचन बरन बिराज सुबेसा। कानन कुंडल कुंचित केसा॥',
      transliteration: 'kanchana barana birāja subesā, kānana kundala kunchita kesā',
      translation: 'Golden-hued and beautifully adorned, with rings in your ears and curling hair.',
    },
    {
      t: 64,
      section: 'Chaupai',
      devanagari: 'हाथ बज्र औ ध्वजा बिराजै। काँधे मूँज जनेऊ साजै॥',
      transliteration: 'hātha bajra au dhvajā birājai, kāndhe mūnja janeū sājai',
      translation: 'In your hands shine mace and banner; a sacred thread graces your shoulder.',
    },
    {
      t: 72,
      section: 'Chaupai',
      devanagari: 'शंकर सुवन केसरी नंदन। तेज प्रताप महा जग बंदन॥',
      transliteration: 'shankara suvana kesarī nandana, teja pratāpa mahā jaga bandana',
      translation: "Portion of Shiva, delight of Kesari; your splendor is revered by all the world.",
    },
    {
      t: 80,
      section: 'Chaupai',
      devanagari: 'विद्यावान गुनी अति चातुर। राम काज करिबे को आतुर॥',
      transliteration: 'vidyāvāna gunī ati chātura, rāma kāja karibe ko ātura',
      translation: 'Learned, virtuous and exceedingly clever, ever eager to do the work of Rama.',
    },
    {
      t: 88,
      section: 'Chaupai',
      devanagari: 'प्रभु चरित्र सुनिबे को रसिया। राम लखन सीता मन बसिया॥',
      transliteration: 'prabhu charitra sunibe ko rasiyā, rāma lakhana sītā mana basiyā',
      translation:
        "You delight in the Lord's story; Rama, Lakshmana and Sita dwell within your heart.",
    },
    {
      t: 96,
      section: 'Doha',
      devanagari: 'पवनतनय संकट हरन, मंगल मूरति रूप।',
      transliteration: 'pavana-tanaya sankata harana, mangala mūrati rūpa',
      translation: 'O son of the Wind, remover of distress, embodiment of auspiciousness,',
    },
    {
      t: 104,
      section: 'Doha',
      devanagari: 'राम लखन सीता सहित, हृदय बसहु सुर भूप॥',
      transliteration: 'rāma lakhana sītā sahita, hridaya basahu sura bhūpa',
      translation: 'dwell in my heart with Rama, Lakshmana and Sita, O king among the gods.',
    },
  ],
};

const omJaiJagdish: Track = {
  id: 'om-jai-jagdish-hare',
  title: 'Om Jai Jagdish Hare',
  devanagari: 'ॐ जय जगदीश हरे',
  kind: 'aarti',
  deityId: 'vishnu',
  language: 'hi',
  artist: 'Traditional · Shardha Ram Phillauri',
  duration: 72,
  audio: null,
  isFree: true,
  previewSeconds: 45,
  attribution: 'Pandit Shardha Ram Phillauri (1870) · public domain',
  tags: ['aarti', 'universal', 'evening'],
  lyrics: [
    {
      t: 0,
      section: 'Refrain',
      devanagari: 'ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।',
      transliteration: 'oṁ jaya jagadīsha hare, swāmī jaya jagadīsha hare',
      translation: 'Om, victory to the Lord of the universe, O master, victory to you.',
    },
    {
      t: 10,
      section: 'Refrain',
      devanagari: 'भक्त जनों के संकट, क्षण में दूर करे॥',
      transliteration: 'bhakta janon ke sankata, kshana men dūra kare',
      translation: 'You remove the troubles of your devotees in an instant.',
    },
    {
      t: 20,
      section: 'Verse 1',
      devanagari: 'जो ध्यावे फल पावे, दुख बिनसे मन का।',
      transliteration: 'jo dhyāve phala pāve, dukha binase mana kā',
      translation: 'Whoever meditates on you gains the fruit; the sorrow of the mind is destroyed.',
    },
    {
      t: 30,
      section: 'Verse 1',
      devanagari: 'सुख सम्पति घर आवे, कष्ट मिटे तन का॥',
      transliteration: 'sukha sampati ghara āve, kashta mite tana kā',
      translation: 'Happiness and prosperity come home, and bodily suffering is removed.',
    },
  ],
};

const gayatri: Track = {
  id: 'gayatri-mantra',
  title: 'Gayatri Mantra',
  devanagari: 'गायत्री मंत्र',
  kind: 'mantra',
  deityId: 'surya',
  language: 'sa',
  artist: 'Vedic · Rishi Vishvamitra',
  duration: 40,
  audio: null,
  isFree: true,
  attribution: 'Rig Veda 3.62.10 · public domain',
  tags: ['dawn', 'clarity', 'vedic'],
  lyrics: [
    {
      t: 0,
      devanagari: 'ॐ भूर्भुवः स्वः।',
      transliteration: 'oṁ bhūr bhuvaḥ svaḥ',
      translation: 'Om. The earth, the atmosphere, the heavens.',
    },
    {
      t: 8,
      devanagari: 'तत्सवितुर्वरेण्यं।',
      transliteration: 'tat savitur vareṇyaṁ',
      translation: 'That adorable splendor of the divine Sun,',
    },
    {
      t: 16,
      devanagari: 'भर्गो देवस्य धीमहि।',
      transliteration: 'bhargo devasya dhīmahi',
      translation: 'the radiant light of the deity, on which we meditate —',
    },
    {
      t: 24,
      devanagari: 'धियो यो नः प्रचोदयात्॥',
      transliteration: 'dhiyo yo naḥ prachodayāt',
      translation: 'may it illumine and inspire our understanding.',
    },
  ],
};

const vakratunda: Track = {
  id: 'vakratunda-mahakaya',
  title: 'Vakratunda Mahakaya',
  devanagari: 'वक्रतुण्ड महाकाय',
  kind: 'mantra',
  deityId: 'ganesha',
  language: 'sa',
  artist: 'Traditional',
  duration: 24,
  audio: null,
  isFree: true,
  attribution: 'Ganesha dhyana shloka · public domain',
  tags: ['beginnings', 'obstacles'],
  lyrics: [
    {
      t: 0,
      devanagari: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।',
      transliteration: 'vakratuṇḍa mahākāya sūryakoṭi samaprabha',
      translation: 'O curved-trunk, mighty-bodied one, radiant as ten million suns,',
    },
    {
      t: 12,
      devanagari: 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      transliteration: 'nirvighnaṁ kuru me deva sarva-kāryeṣu sarvadā',
      translation: 'make all my endeavors free of obstacles, O Lord, always.',
    },
  ],
};

const mahaMantra: Track = {
  id: 'hare-krishna-maha-mantra',
  title: 'Hare Krishna Maha Mantra',
  devanagari: 'हरे कृष्ण महामंत्र',
  kind: 'mantra',
  deityId: 'krishna',
  language: 'sa',
  artist: 'Traditional',
  duration: 32,
  audio: null,
  isFree: true,
  attribution: 'Kali-Santarana Upanishad · public domain',
  tags: ['kirtan', 'japa', 'joy'],
  lyrics: [
    {
      t: 0,
      devanagari: 'हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे।',
      transliteration: 'hare kṛṣṇa hare kṛṣṇa, kṛṣṇa kṛṣṇa hare hare',
      translation: 'O energy of the Lord, O all-attractive Lord, please engage me in your service.',
    },
    {
      t: 16,
      devanagari: 'हरे राम हरे राम, राम राम हरे हरे॥',
      transliteration: 'hare rāma hare rāma, rāma rāma hare hare',
      translation: 'O energy of the Lord, O reservoir of joy, please engage me in your service.',
    },
  ],
};

const omNamahShivaya: Track = {
  id: 'om-namah-shivaya',
  title: 'Om Namah Shivaya',
  devanagari: 'ॐ नमः शिवाय',
  kind: 'mantra',
  deityId: 'shiva',
  language: 'sa',
  artist: 'Traditional',
  duration: 30,
  audio: null,
  isFree: true,
  attribution: 'Panchakshara mantra, Yajurveda · public domain',
  tags: ['monday', 'stillness', 'japa'],
  lyrics: [
    {
      t: 0,
      devanagari: 'ॐ नमः शिवाय।',
      transliteration: 'oṁ namaḥ śivāya',
      translation: 'Om, I bow to Shiva — the auspicious inner Self.',
    },
    {
      t: 10,
      devanagari: 'ॐ नमः शिवाय।',
      transliteration: 'oṁ namaḥ śivāya',
      translation: 'Om, I bow to Shiva — the auspicious inner Self.',
    },
    {
      t: 20,
      devanagari: 'ॐ नमः शिवाय।',
      transliteration: 'oṁ namaḥ śivāya',
      translation: 'Om, I bow to Shiva — the auspicious inner Self.',
    },
  ],
};

const morningMeditation: Track = {
  id: 'morning-stillness',
  title: 'Morning Stillness',
  kind: 'meditation',
  deityId: 'shiva',
  language: 'en',
  artist: 'Diya',
  duration: 60,
  audio: null,
  isFree: false,
  previewSeconds: 20,
  attribution: 'Original guided practice',
  tags: ['meditation', 'breath', 'morning'],
  lyrics: [
    { t: 0, transliteration: 'Settle comfortably, spine easy, eyes softly closed.', translation: 'Arrive.' },
    { t: 12, transliteration: 'Breathe in for four… and release for six.', translation: 'Lengthen the exhale.' },
    { t: 28, transliteration: 'Silently offer: Om Namah Shivaya.', translation: 'Let the mantra arise on its own.' },
    { t: 44, transliteration: 'Rest in the stillness between two breaths.', translation: 'This is the temple within.' },
  ],
};

export const TRACKS: Track[] = [
  hanumanChalisa,
  omJaiJagdish,
  gayatri,
  vakratunda,
  mahaMantra,
  omNamahShivaya,
  morningMeditation,
];
