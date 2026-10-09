// Génère site/data.json à partir du dossier templates/.
// Les prompts sont chiffrés (AES-256-GCM, clé dérivée du code d'accès par PBKDF2) :
// sans le code, le fichier publié ne contient que les titres, catégories et vidéos.
//
// Usage : ACCESS_CODE="mon-code" node scripts/build.mjs
import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto as crypto } from 'node:crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const code = process.env.ACCESS_CODE;
if (!code) {
  console.error('ACCESS_CODE manquant : ACCESS_CODE="..." node scripts/build.mjs');
  process.exit(1);
}

const exists = (p) => access(p).then(() => true, () => false);
const readIf = async (p) => ((await exists(p)) ? (await readFile(p, 'utf8')).trim() : null);

const templates = [];
const prompts = {};
for (const slug of (await readdir(join(root, 'templates'))).sort()) {
  const dir = join(root, 'templates', slug);
  if (!(await exists(join(dir, 'meta.json')))) continue;
  const meta = JSON.parse(await readFile(join(dir, 'meta.json'), 'utf8'));
  const original = await readIf(join(dir, 'prompt-original.md'));
  const detaille = await readIf(join(dir, 'prompt-detaille.md'));
  if (!original) throw new Error(`${slug} : prompt-original.md manquant`);
  for (const f of [`videos/${slug}.mp4`, `posters/${slug}.jpg`]) {
    if (!(await exists(join(root, 'site', f)))) throw new Error(`${slug} : site/${f} manquant (lancer prepare-video.sh)`);
  }
  templates.push({
    slug,
    ...meta,
    // « Rapide » = prompt d'origine court ; « Détaillé » = prompt d'origine déjà complet
    type: original.length < 600 ? 'Rapide' : 'Détaillé',
    aVersionDetaillee: Boolean(detaille),
  });
  prompts[slug] = { original, detaille };
}

const enc = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const iterations = 250000;
const baseKey = await crypto.subtle.importKey('raw', enc.encode(code.trim()), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
  baseKey,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
);
const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(prompts)));
const b64 = (buf) => Buffer.from(buf).toString('base64');

await writeFile(
  join(root, 'site', 'data.json'),
  JSON.stringify({ templates, coffre: { salt: b64(salt), iv: b64(iv), iterations, data: b64(cipher) } }),
);
console.log(`site/data.json : ${templates.length} modèles, prompts chiffrés.`);
