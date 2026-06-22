/**
 * Content integrity check. Fails (exit 1) if any reference in the catalog is
 * broken — e.g. a track points at a missing deity, a journey day references a
 * missing track, or a quiz answer is out of range. Run:  npm run content:check
 *
 * This is the safety net for content edits (bundled or, later, from a CMS).
 */
import { BUNDLED } from '../src/lib/content/source';

const errors: string[] = [];
const deityIds = new Set(BUNDLED.deities.map((d) => d.id));
const trackIds = new Set(BUNDLED.tracks.map((t) => t.id));
const verseRefs = new Set<string>();
for (const s of BUNDLED.scriptures)
  for (const c of s.chapters) for (const v of c.verses) verseRefs.add(`${s.id}:${c.number}:${v.ref}`);

for (const t of BUNDLED.tracks) {
  if (!deityIds.has(t.deityId)) errors.push(`track "${t.id}" → unknown deity "${t.deityId}"`);
  if (!t.lyrics?.length) errors.push(`track "${t.id}" → no lyrics`);
}

for (const j of BUNDLED.journeys) {
  if (j.deityId && !deityIds.has(j.deityId)) errors.push(`journey "${j.id}" → unknown deity "${j.deityId}"`);
  j.days.forEach((d, i) => {
    for (const id of d.trackIds) if (!trackIds.has(id)) errors.push(`journey "${j.id}" day ${i + 1} → unknown track "${id}"`);
    if (d.verse) {
      const key = `${d.verse.scriptureId}:${d.verse.chapter}:${d.verse.ref}`;
      if (!verseRefs.has(key)) errors.push(`journey "${j.id}" day ${i + 1} → unknown verse "${key}"`);
    }
  });
}

for (const st of BUNDLED.stories) {
  if (st.deityId && !deityIds.has(st.deityId)) errors.push(`story "${st.id}" → unknown deity "${st.deityId}"`);
  (BUNDLED.quizzes[st.id] ?? []).forEach((q, i) => {
    if (q.answer < 0 || q.answer >= q.options.length) errors.push(`story "${st.id}" quiz ${i + 1} → answer out of range`);
  });
}

for (const f of BUNDLED.festivals) {
  if (f.deityId && !deityIds.has(f.deityId)) errors.push(`festival "${f.id}" → unknown deity "${f.deityId}"`);
}

if (errors.length) {
  console.error(`✗ content check failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):`);
  for (const e of errors) console.error('   - ' + e);
  process.exit(1);
}

console.log(
  `✓ content OK — ${BUNDLED.deities.length} deities · ${BUNDLED.tracks.length} tracks · ` +
    `${BUNDLED.journeys.length} journeys · ${BUNDLED.stories.length} stories · ${BUNDLED.festivals.length} festivals`,
);
