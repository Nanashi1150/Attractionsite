import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
await mkdir('.test-output', { recursive: true });
await build({
  entryPoints: ['tests/behaviour.test.tsx', 'tests/pages.test.tsx'],
  outdir: '.test-output', outExtension: { '.js': '.mjs' },
  bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic',
  plugins: [{ name: 'figma-package-imports', setup(build) {
    build.onResolve({ filter: /^[^./].+@\d/ }, args => ({ path: args.path.replace(/@\d[^/]*(?=\/|$)/, ''), external: true }));
  } }],
});
const result = spawnSync(process.execPath, ['--test', '.test-output/behaviour.test.mjs', '.test-output/pages.test.mjs'], { stdio: 'inherit' });
process.exitCode = result.status ?? 1;
