import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { minify } from 'terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const outFile = path.join(distDir, 'game.min.js');

await mkdir(distDir, { recursive: true });

// 1) Bundle + minify (baseline)
await build({
  entryPoints: [path.join(__dirname, 'game.js')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2018'],
  sourcemap: false,
  minify: true,
  legalComments: 'none',
  outfile: outFile,
});

// 2) Extra mangling pass
const code = await readFile(outFile, 'utf8');
const result = await minify(code, {
  compress: true,
  mangle: {
    toplevel: true,
  },
  format: {
    comments: false,
  },
  toplevel: true,
});

if (result.error) {
  throw result.error;
}

await writeFile(outFile, result.code ?? '', 'utf8');
console.log('Built', path.relative(__dirname, outFile));
