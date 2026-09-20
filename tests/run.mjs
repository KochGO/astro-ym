import { execFileSync } from 'node:child_process';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fixture = join(root, 'tests', 'fixture');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const shell = process.platform === 'win32'; // ponytail: .cmd нельзя spawn-ить без shell (Node >= 20.12, EINVAL)

const ASSERTS = [
  ['mc.yandex.ru/metrika/tag.js?id=105876116', 'scriptSrc в define:vars'],
  ['window.ym', 'очередь-заглушка инициализации'],
  ['mc.yandex.ru/watch/105876116', 'noscript'],
  ['astro:page-load', 'ClientRouter-хук'],
];

let failed = false;

for (const v of ['7', '6']) {
  try {
    if (v === '7') {
      // ponytail: npm не ставит peer astro для file:-deps — ставим явно ниже
      execFileSync(npm, ['install', '--prefix', fixture], { stdio: 'inherit', cwd: root, shell });
    }
    execFileSync(npm, ['install', '--prefix', fixture, `astro@^${v}`, '--no-audit', '--no-fund'], { stdio: 'inherit', cwd: root, shell });

    execFileSync(npm, ['run', 'build', '--prefix', fixture], { stdio: 'inherit', cwd: root, shell });

    const html = readFileSync(join(fixture, 'dist', 'index.html'), 'utf8');
    for (const [needle, desc] of ASSERTS) {
      assert.ok(html.includes(needle), `отсутствует: ${needle} (${desc})`);
    }
    console.log(`Astro ${v}: OK`);
  } catch (err) {
    failed = true;
    const msg = err.stdout?.toString() || err.message;
    console.error(`Astro ${v}: FAIL — ${msg.split('\n').slice(-5).join('\n')}`);
  }
}

process.exitCode = failed ? 1 : 0;
