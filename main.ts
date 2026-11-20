// Neon Vice Cover Lab — hand-in program (Node 22, standard library only).
//
// The artwork lives in app/ as plain static files (open app/index.html in a
// desktop browser, no build step, no network). This program's only job is
// delivery: stage a copy of app/ and screenshots/ into the output directory
// and write dossier.json there with the vendored make.fun dossier builder,
// using the scorer's caps so anything the scorer would refuse fails here
// first, locally, instead of after submission.
//
// Local dry run outside the grader container:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Caps mirrored from the competition gate: the text cap shapes the dossier
// bytes; the rest are refusal limits (screenshot count/bytes, app tree size).
const GATE_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
};

function stageFolder(name: string): void {
  const from = join(repoRoot, name);
  const to = join(outputDir, name);
  if (!existsSync(from)) return;
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
stageFolder('app');
stageFolder('screenshots');

const dossierBytes = buildDossier(outputDir, GATE_CAPS);
writeFileSync(join(outputDir, 'dossier.json'), dossierBytes);
console.log(`Neon Vice Cover Lab staged into ${outputDir} (dossier ${dossierBytes.length} bytes)`);
