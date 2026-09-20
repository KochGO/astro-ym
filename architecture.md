# astro-ym: архитектура инкремента «совместимость с Astro 6/7»

Дата: 2026-09-20. Источник требований: `2026-09-20-astro-ym-astro7-fixes.md` (инкремент D1 KOCHGO).

## Проблема

`peerDependencies.astro = "^4.0.0 || ^5.0.0"` → `npm install astro-ym` падает с ERESOLVE
на проектах с Astro 6/7. Пакет не интегрирован в KOCHGO, там временный inline-сниппет.

## Анализ совместимости (поверхность API)

Компонент `src/YandexMetrika.astro` использует только:

| API | Статус в Astro 6/7 |
|---|---|
| `Astro.props` | стабильно |
| `<script is:inline>` + `define:vars` | стабильно |
| событие `astro:page-load` (ClientRouter) | стабильно (с Astro 4/5, без переименований) |
| `<noscript>`-разметка | вне Astro API |

Пакет **не использует**: integration hooks, content collections, adapter API, конфиг Astro.
Разрывов на 6/7 не ожидается; риск только в peer-диапазоне. Проверка — сборочным тестом (ниже).

## Изменения

### 1. `package.json`

- `peerDependencies.astro` → `"^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0"` (точно по спеке).
- `version` → `1.1.1` (patch: расширение peer-диапазона, публикация вручную владельцем).
- `devDependencies.astro` — **не трогаем** (ни один script его не использует; локальный dev only).
- Добавить script: `"test": "node tests/run.mjs"`.

### 2. Сборочный тест на Astro 6 и 7 (`tests/`)

Новые файлы (в публикацию не попадают — `files` ограничен `src`, `index.ts`, `README.md`;
артефакты покрыты существующим `.gitignore`: `node_modules`, `dist`):

```
tests/fixture/package.json        # private; deps: astro-ym "file:../.." ; astro ставит раннер
tests/fixture/astro.config.mjs    # export default defineConfig({})  (static, дефолт)
tests/fixture/src/pages/index.astro  # <YandexMetrika counterId={105876116} lazy={true} />
tests/run.mjs                     # оркестратор, чистый node (node:child_process, node:assert)
```

`tests/run.mjs` для каждой мажорной версии `["7", "6"]`:
1. `npm install --prefix tests/fixture` (первая итерация), затем
   `npm install --prefix tests/fixture astro@^<v> --no-audit --no-fund`;
2. `npm run build --prefix tests/fixture` → exit code 0;
3. Читает `tests/fixture/dist/index.html` и ассертит:
   - содержит `mc.yandex.ru/metrika/tag.js?id=105876116` (scriptSrc в define:vars);
   - содержит `window.ym` (очередь-заглушка инициализации);
   - содержит `mc.yandex.ru/watch/105876116` (noscript);
   - содержит `astro:page-load` (ClientRouter-хук).
4. Любой провал → non-zero exit, понятное сообщение с версией.

На Windows npm вызывать как `npm.cmd` (execFileSync).

### 3. `README.md` (ступень routine)

- Строка «Designed for Astro 4+ and Astro 5+» → поддержка Astro 4–7.
- Больше ничего в README не менять.

## Границы инкремента (out of scope)

- Замена inline-сниппета в KOCHGO (`src/layouts/Base.astro`) — другой репозиторий, после публикации.
- GA4 (`Analytics.astro`) — без изменений по спеке.
- Браузерные проверки (lazy-загрузка в Network, очередь `ym(...)` до tag.js) — чек-лист KOCHGO,
  выполняется на стороне потребителя после публикации 1.1.1.
- `npm publish` — вручную владельцем пакета после зелёного теста.

## Проверка результата

- `npm test` в корне `astro-ym` — зелёный на обеих версиях.
- `npm pack --dry-run` — в тарболе только `src/`, `index.ts`, `README.md`, `package.json` (tests/ не попали).
- `git diff` — затронуты: `package.json`, `README.md`, `tests/**`, `architecture.md`.
