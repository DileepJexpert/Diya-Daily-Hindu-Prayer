/**
 * Generates public/catalog.json from the bundled seed content.
 *
 * This is the payload a CMS/CDN would serve. It lets you demo the "update
 * content without an app update" flow (see README) and gives editors a real
 * starting file. Run:  npm run content:export
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { BUNDLED } from '../src/lib/content/source';

const out = resolve(process.cwd(), 'public/catalog.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(BUNDLED, null, 2)}\n`);

console.log(
  `Wrote ${out}\n  ${BUNDLED.deities.length} deities · ${BUNDLED.tracks.length} tracks · ` +
    `${BUNDLED.scriptures.length} scriptures · ${BUNDLED.stories.length} stories · ` +
    `${BUNDLED.journeys.length} journeys · ${BUNDLED.challenges.length} challenges · ${BUNDLED.festivals.length} festivals`,
);
