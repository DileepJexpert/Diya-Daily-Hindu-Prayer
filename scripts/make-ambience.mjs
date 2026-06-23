/**
 * Generate ORIGINAL, royalty-free ambience loops for the darshan soundscape
 * picker. Everything here is synthesized from scratch (harmonic sine drones,
 * filtered noise, inharmonic bell partials), so there is ZERO licensing or
 * copyright concern — we own these outright. Loops are built to be seamless.
 *
 *   node scripts/make-ambience.mjs   →   public/audio/ambience/*.wav
 */
import { mkdirSync, writeFileSync } from 'node:fs';

const SR = 22050; // mono, 16-bit PCM
const OUT = 'public/audio/ambience';

function writeWav(name, samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  writeFileSync(`${OUT}/${name}`, buf);
  console.log(`  ${name}  ${(buf.length / 1024).toFixed(0)} KB  ${(n / SR).toFixed(1)}s`);
}

function normalize(out, peak = 0.6) {
  let p = 1e-6;
  for (let i = 0; i < out.length; i++) p = Math.max(p, Math.abs(out[i]));
  const g = peak / p;
  for (let i = 0; i < out.length; i++) out[i] *= g;
  return out;
}

// deterministic PRNG so the loops regenerate identically every run
let seed = 1234567;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed / 0x7fffffff) * 2 - 1; };

// ── Om drone — harmonic sines; integer cycles make the loop seamless ─────────
function omDrone() {
  const base = 136.1 / 2; // half f0 so the 1.5×f0 "fifth" is an integer multiple
  const cycles = Math.round(8 * base);
  const dur = cycles / base;
  const N = Math.round(dur * SR);
  const partials = [[2, 0.5], [3, 0.22], [4, 0.18], [6, 0.08], [8, 0.05]]; // [×base, amp]
  const out = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    let s = 0;
    for (const [h, a] of partials) s += a * Math.sin(2 * Math.PI * h * base * t);
    const lfo = 0.9 + 0.1 * Math.sin((2 * Math.PI * 3 * t) / dur); // 3 cycles → seamless
    out[i] = s * lfo;
  }
  return normalize(out, 0.55);
}

// ── Seamless filtered-noise loop (river / rain) via equal-power crossfade ─────
function noiseLoop({ seconds, lpAlpha, hpMix = 0 }) {
  const L = Math.round(seconds * SR);
  const X = Math.round(0.75 * SR);
  const raw = new Float32Array(L + X);
  let lp = 0;
  for (let i = 0; i < raw.length; i++) {
    const w = rnd();
    lp += lpAlpha * (w - lp);
    raw[i] = hpMix > 0 ? lp * (1 - hpMix) + (w - lp) * hpMix : lp;
  }
  const out = new Float32Array(L);
  for (let i = 0; i < L; i++) {
    if (i < X) {
      const win = i / X;
      out[i] = raw[i] * Math.sqrt(win) + raw[L + i] * Math.sqrt(1 - win);
    } else out[i] = raw[i];
  }
  return normalize(out, 0.5);
}

// ── Temple bells — sparse decaying inharmonic strikes over silence ───────────
function templeBells() {
  const dur = 12, N = Math.round(dur * SR);
  const out = new Float32Array(N);
  const ratios = [1, 2.0, 2.76, 4.07, 5.43]; // bell-like inharmonic partials
  const strike = (startT, f0, amp) => {
    const start = Math.round(startT * SR);
    for (let i = start; i < N; i++) {
      const t = (i - start) / SR;
      const env = Math.exp(-t / 0.7);
      if (env < 0.0004) break;
      let s = 0;
      for (let p = 0; p < ratios.length; p++) s += Math.sin(2 * Math.PI * f0 * ratios[p] * t) / (p + 1);
      out[i] += s * env * amp;
    }
  };
  strike(1.0, 392, 0.5);
  strike(5.0, 330, 0.42);
  strike(8.5, 392, 0.36);
  normalize(out, 0.6);
  // Guarantee a click-free seam: brief fade in/out at the loop boundary.
  const fo = Math.round(0.4 * SR);
  for (let i = 0; i < fo; i++) out[N - 1 - i] *= i / fo;
  const fi = Math.round(0.02 * SR);
  for (let i = 0; i < fi; i++) out[i] *= i / fi;
  return out;
}

mkdirSync(OUT, { recursive: true });
console.log('Generating original ambience loops →', OUT);
writeWav('om-drone.wav', omDrone());
writeWav('temple-bells.wav', templeBells());
writeWav('river.wav', noiseLoop({ seconds: 15, lpAlpha: 0.05 }));
writeWav('rain.wav', noiseLoop({ seconds: 15, lpAlpha: 0.22, hpMix: 0.4 }));
console.log('Done — original, royalty-free, no attribution required.');
