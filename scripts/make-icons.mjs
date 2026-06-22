/**
 * Generates the Diya brand icon/splash assets from a single vector logo
 * (a gold oil-lamp with a glowing flame). Run:  node scripts/make-icons.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DIR = resolve(process.cwd(), 'assets/images');

/** The Diya mark in a 0..100 viewBox; `scale` shrinks it for the Android safe zone. */
function logoSvg({ size, bg = false, mono = false, scale = 1 }) {
  const flame = mono ? '#ffffff' : 'url(#flame)';
  const core = mono ? '#ffffff' : '#FFF6D6';
  const bowl = mono ? '#ffffff' : 'url(#bowl)';
  const group = `
    <g transform="translate(50,52) scale(${scale}) translate(-50,-52)">
      ${mono ? '' : '<circle cx="50" cy="45" r="28" fill="#F4A300" opacity="0.30"/>'}
      <path d="M50 23 C 59 36, 61 47, 54 55 C 50 59, 44 59, 41 54 C 36 46, 43 36, 50 23 Z" fill="${flame}"/>
      ${mono ? '' : `<path d="M50 35 C 54 42, 55 49, 51 54 C 48 57, 44 54, 45 49 C 46 44, 48 40, 50 35 Z" fill="${core}" opacity="0.92"/>`}
      <path d="M16 60 C 34 53, 66 53, 84 60 C 75 77, 61 83, 50 83 C 39 83, 25 77, 16 60 Z" fill="${bowl}"/>
      ${mono ? '' : '<ellipse cx="50" cy="60" rx="34" ry="5.5" fill="#9E2B25" opacity="0.5"/>'}
    </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="bgg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#F4A300"/><stop offset="0.55" stop-color="#E8772E"/><stop offset="1" stop-color="#C75B17"/>
      </linearGradient>
      <radialGradient id="flame" cx="0.5" cy="0.72" r="0.72">
        <stop offset="0" stop-color="#FFF6D6"/><stop offset="0.5" stop-color="#F4A300"/><stop offset="1" stop-color="#C75B17"/>
      </radialGradient>
      <linearGradient id="bowl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#E4C77E"/><stop offset="0.5" stop-color="#C9A24B"/><stop offset="1" stop-color="#9E2B25"/>
      </linearGradient>
    </defs>
    ${bg ? '<rect width="100" height="100" fill="url(#bgg)"/>' : ''}
    ${group}
  </svg>`;
}

const solid = (size, color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${color}"/></svg>`;

async function png(svg, file) {
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(resolve(DIR, file), buf);
  console.log('  ✓', file);
}

console.log('Diya brand assets →', DIR);
await png(logoSvg({ size: 1024, bg: true }), 'icon.png');
await png(logoSvg({ size: 512, bg: false }), 'splash-icon.png');
await png(logoSvg({ size: 196, bg: true }), 'favicon.png');
await png(logoSvg({ size: 432, bg: false, scale: 0.62 }), 'android-icon-foreground.png');
await png(solid(432, '#FFFBF4'), 'android-icon-background.png');
await png(logoSvg({ size: 432, bg: false, mono: true, scale: 0.62 }), 'android-icon-monochrome.png');
console.log('Done.');
