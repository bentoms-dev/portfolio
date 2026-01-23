import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const sourceDir = path.join(repoRoot, 'subway-game');
const destDir = path.join(repoRoot, 'public', 'subway-game');
const publicDir = path.join(repoRoot, 'public');

const shouldExclude = (relativePath) => {
  const normalized = relativePath.split(path.sep).join('/');

  const segments = normalized.split('/');
  const baseName = segments[segments.length - 1] ?? '';

  if (baseName === '.DS_Store') return true;
  if (baseName.startsWith('._')) return true;
  if (segments.includes('node_modules')) return true;
  if (baseName === 'package-lock.json') return true;
  if (baseName === 'package.json') return true;
  return false;
};

const removeFinderArtifacts = async (dir) => {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Avoid scanning massive dependency trees if they exist under public
        if (entry.name === 'node_modules') return;
        await removeFinderArtifacts(entryPath);
        return;
      }

      if (!entry.isFile()) return;

      if (entry.name === '.DS_Store' || entry.name.startsWith('._')) {
        await fs.rm(entryPath, { force: true });
      }
    })
  );
};

const copyDir = async (fromDir, toDir, relativeBase = '') => {
  const entries = await fs.readdir(fromDir, { withFileTypes: true });
  await fs.mkdir(toDir, { recursive: true });

  for (const entry of entries) {
    const fromPath = path.join(fromDir, entry.name);
    const toPath = path.join(toDir, entry.name);
    const rel = path.join(relativeBase, entry.name);

    if (shouldExclude(rel)) continue;

    if (entry.isDirectory()) {
      await copyDir(fromPath, toPath, rel);
      continue;
    }

    if (entry.isFile()) {
      await fs.copyFile(fromPath, toPath);
    }
  }
};

try {
  await fs.access(sourceDir);
} catch {
  console.error(`[copy-subway-game] Source folder not found: ${sourceDir}`);
  process.exit(1);
}

// Next.js treats files in /public as routable paths. Finder/AppleDouble files
// (e.g. public/._subway-game) can conflict with a page route like /subway-game.
await removeFinderArtifacts(publicDir);

await fs.rm(destDir, { recursive: true, force: true });
await copyDir(sourceDir, destDir);

// Clean again in case the OS creates artifacts during copy operations.
await removeFinderArtifacts(publicDir);

console.log('[copy-subway-game] Copied subway-game -> public/subway-game');
