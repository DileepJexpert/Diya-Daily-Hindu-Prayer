/**
 * Print an audio file's duration in seconds — handy when adding a real recording
 * so you can set the track's `duration`. Usage:
 *   node scripts/audio-duration.mjs public/audio/your-file.mp3
 */
import { parseFile } from 'music-metadata';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/audio-duration.mjs <audio-file>');
  process.exit(1);
}
const meta = await parseFile(file);
console.log(Math.round(meta.format.duration ?? 0));
