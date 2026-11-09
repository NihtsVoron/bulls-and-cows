import { cp, mkdir, rm } from 'node:fs/promises';

await rm('site', { recursive: true, force: true });
await mkdir('site', { recursive: true });
await cp('index.html', 'site/index.html');
await cp('styles.css', 'site/styles.css');
await cp('dist', 'site/dist', { recursive: true });
