// main.ts — writes one one-line joke to /output/entry.txt.
// Node 22, standard library only. Reads the joke from joke.txt next to
// this file and copies it verbatim (no trailing newline added or removed
// beyond what the file holds) to MAKEFUN_OUTPUT_DIR || /output.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const joke = readFileSync(join(here, 'joke.txt'), 'utf8');
// Normalise line endings, then drop exactly one trailing newline (and a
// stray trailing carriage return) so the output is a single clean line.
const text = joke.replace(/\r\n/g, '\n').replace(/\r$/, '').replace(/\n$/, '');

// The gate: 1 to 280 Unicode code points, one line, not only whitespace.
const points = [...text].length;
if (points < 1 || points > 280) {
  throw new Error(`joke is ${points} code points, must be 1-280`);
}
if (text.includes('\n') || text.trim().length === 0) {
  throw new Error('joke must be a single non-blank line');
}

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'entry.txt'), text, 'utf8');
