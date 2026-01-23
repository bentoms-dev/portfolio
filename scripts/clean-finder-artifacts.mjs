import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

const EXCLUDED_DIRS = new Set(['node_modules', '.git', '.next']);

const isArtifact = (name) => name === '.DS_Store' || name.startsWith('._');

const cleanDir = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (EXCLUDED_DIRS.has(entry.name)) return;
        await cleanDir(entryPath);
        return;
      }

      if (!entry.isFile()) return;

      if (isArtifact(entry.name)) {
        await fs.rm(entryPath, { force: true });
      }
    })
  );
};

await cleanDir(repoRoot);
console.log('[clean-finder-artifacts] Removed .DS_Store and ._* files');
