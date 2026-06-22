import { Share } from 'react-native';

/** Share plain text via the OS share sheet (WhatsApp, Messages, etc.). */
export async function shareText(message: string) {
  try {
    await Share.share({ message });
  } catch {
    /* user dismissed — no-op */
  }
}

export function formatVerseShare(title: string, ref: string, transliteration: string, translation: string) {
  const t = transliteration.split('\n').join(' ');
  return `॥ ${title} ${ref} ॥\n\n${t}\n\n“${translation}”\n\n— shared from Diya 🪔`;
}

export function formatStoryShare(title: string, moral?: string) {
  return `${title}\n\n${moral ? `“${moral}”\n\n` : ''}A little story from Diya 🪔`;
}

export function formatTrackShare(title: string, firstLine?: string) {
  return `${title}${firstLine ? `\n\n${firstLine}` : ''}\n\n— shared from Diya 🪔`;
}
