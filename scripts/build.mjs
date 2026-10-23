import { cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');

await mkdir(output, { recursive: true });
for (const source of ['index.html', 'css', 'js', 'assets']) {
  await cp(resolve(root, source), resolve(output, source), {
    recursive: true,
    filter: path => !path.endsWith('README.md'),
  });
}
console.log('Site estático preparado em dist/');
