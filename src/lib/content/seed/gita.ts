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
    {
      number: 12,
      title: 'Bhakti Yoga — The Yoga of Devotion',
      devanagari: 'भक्तियोग',
      summary:
        'Krishna praises loving devotion as the most accessible path, and describes the qualities of one who is dear to the Divine.',
      verses: [
        {
          ref: '12.8',
          devanagari:
            'मय्येव मन आधत्स्व मयि बुद्धिं निवेशय।\nनिवसिष्यसि मय्येव अत ऊर्ध्वं न संशयः॥',
          transliteration:
            'mayy eva mana ādhatsva mayi buddhiṁ niveśaya\nnivasiṣyasi mayy eva ata ūrdhvaṁ na saṁśayaḥ',
          translation:
            'Fix your mind on Me alone and rest your understanding in Me; thereafter you will dwell in Me — of this there is no doubt.',
        },
        {
          ref: '12.13',
          devanagari:
            'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च।\nनिर्ममो निरहंकारः समदुःखसुखः क्षमी॥',
          transliteration:
            'adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca\nnirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī',
          translation:
            'One who hates no creature, who is friendly and compassionate, free of possessiveness and ego, even-minded in pain and pleasure, and forgiving —',
          commentary: 'The opening of Krishna’s portrait of the devotee who is dear to him.',
        },
      ],
    },
    {
      number: 15,
      title: 'Purushottama Yoga — The Supreme Person',
      devanagari: 'पुरुषोत्तमयोग',
      summary:
        'The world is likened to an eternal tree; the living being is a fragment of the Divine, who dwells in every heart.',
      verses: [
        {
          ref: '15.7',
          devanagari:
            'ममैवांशो जीवलोके जीवभूतः सनातनः।\nमनःषष्ठानीन्द्रियाणि प्रकृतिस्थानि कर्षति॥',
          transliteration:
            'mamaivāṁśo jīva-loke jīva-bhūtaḥ sanātanaḥ\nmanaḥ-ṣaṣṭhānīndriyāṇi prakṛti-sthāni karṣati',
          translation:
            'An eternal fragment of My own Self becomes the living being in the world of life, drawing to itself the senses and the mind that rest in nature.',
        },
        {
          ref: '15.15',
          devanagari:
            'सर्वस्य चाहं हृदि सन्निविष्टो मत्तः स्मृतिर्ज्ञानमपोहनं च।',
          transliteration:
            'sarvasya cāhaṁ hṛdi sanniviṣṭo mattaḥ smṛtir jñānam apohanaṁ ca',
          translation:
            'I am seated in the heart of all beings; from Me come memory, knowledge and their absence.',
        },
      ],
    },
    {
      number: 9,
      title: 'Raja Vidya Yoga — The Royal Knowledge',
      devanagari: 'राजविद्यायोग',
      summary:
        'The most confidential teaching: the Divine pervades all, sustains the devoted, and accepts the simplest offering made with love.',
      verses: [
        {
          ref: '9.22',
          devanagari:
            'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥',
          transliteration:
            'ananyāś cintayanto māṁ ye janāḥ paryupāsate\nteṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham',
          translation:
            'To those who worship Me alone, thinking of no other, ever steadfast — I bring what they lack and protect what they have.',
        },
        {
          ref: '9.26',
          devanagari:
            'पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति।\nतदहं भक्त्युपहृतमश्नामि प्रयतात्मनः॥',
          transliteration:
            'patraṁ puṣpaṁ phalaṁ toyaṁ yo me bhaktyā prayacchati\ntad ahaṁ bhakty-upahṛtam aśnāmi prayatātmanaḥ',
          translation:
            'Whoever offers Me with devotion a leaf, a flower, a fruit or water — that loving offering from a pure heart, I accept.',
          commentary: 'The verse behind the simplest home puja: it is the love, not the lavishness, that is received.',
        },
      ],
    },
  ],
};
