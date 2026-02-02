# astro-ym

[![npm version](https://img.shields.io/npm/v/astro-ym.svg?style=flat-square)](https://www.npmjs.com/package/astro-ym)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

**Lightweight, type-safe Yandex Metrika integration for Astro.**

Designed for **Astro 4+** and **Astro 5+** (supports both **View Transitions** and the new **Client Router**). It handles SPA navigation correctly out of the box, eliminating duplicate hits and ensuring accurate tracking.

## ✨ Features

- 🚀 **Client Router Support:** Automatically tracks page views on route changes (SPA navigation) using `astro:page-load`.
- 💤 **Lazy Loading:** Optional lazy load of Yandex Metrika script (load on first user interaction or after timeout) for better Lighthouse scores.
- ⚡ **Zero Config:** Smart defaults (Clickmap, Link tracking enabled by default).
- 🛡 **TypeScript:** Fully typed component and helper functions.
- 🎯 **Goals Helper:** Exported `reachGoal` function for easy conversion tracking.
- 🪶 **Lightweight:** Uses the modern Yandex `tag.js` structure and queues calls before the script loads.

## 📦 Installation

```bash
npm install astro-ym
```

## 🚀 Usage

Add the `<YandexMetrika />` component to your main Layout file (e.g., `src/layouts/Layout.astro`). It is recommended to place it before the closing `</body>` tag.

```astro
---
import { YandexMetrika } from 'astro-ym';
---

<html lang="en">
  <head>
    <!-- Your meta tags -->
  </head>
  <body>
    <slot />

    <!-- Basic usage -->
    <YandexMetrika counterId={12345678} />
  </body>
</html>
```

### Advanced Configuration

You can enable/disable specific features via props.

```astro
<YandexMetrika
  counterId={12345678}
  clickmap={true}
  trackLinks={true}
  accurateTrackBounce={true}
  webvisor={true}
  ecommerce="dataLayer"
  params={{ source: "astro" }}
/>
```

### Lazy Loading (recommended for performance)

You can enable lazy loading so that the Yandex Metrika script loads only after the first user interaction (scroll, click, mousemove, touch, keydown) or after a fallback timeout.

```astro
<YandexMetrika
  counterId={12345678}
  webvisor={true}
  lazy={true}
  // optional: fallback timeout in ms (default: 3500)
  timeout={4000}
/>
```

This keeps ym available immediately (calls are queued), but delays loading tag.js to improve performance metrics like TBT and LCP.

## 🎯 Sending Goals (Conversions)

You can trigger goals from anywhere in your client-side code (UI components, scripts) using the exported helper. It automatically detects the counter ID.

### Example in a React/Preact/Solid component:

```tsx
import { reachGoal } from "astro-ym";

export const BuyButton = () => {
  const handleClick = () => {
    // Send goal
    reachGoal("purchase_click");

    // With params
    // reachGoal('purchase_click', { price: 100, currency: 'USD' });
  };

  return <button onClick={handleClick}>Buy Now</button>;
};
```

### Example in Astro script tag:

```html
<script>
  import { reachGoal } from "astro-ym";

  document.getElementById("my-btn")?.addEventListener("click", () => {
    reachGoal("my_target_id");
  });
</script>
```

## 📚 Props Reference

| Prop                  | Type                 | Default      | Description                                                                                   |
| :-------------------- | :------------------- | :----------- | :-------------------------------------------------------------------------------------------- |
| `counterId`           | `number \| string`   | **Required** | Your Yandex Metrika Counter ID.                                                               |
| `ssr`                 | `boolean`            | `true`       | Helps Yandex detect initial server-side load correctly.                                       |
| `webvisor`            | `boolean`            | `false`      | Enables Webvisor (session recording).                                                         |
| `clickmap`            | `boolean`            | `true`       | Enables Click map.                                                                            |
| `trackLinks`          | `boolean`            | `true`       | Tracks external link clicks.                                                                  |
| `accurateTrackBounce` | `boolean \| number`  | `true`       | Accurate bounce rate tracking (true = 15s, or pass custom timeout in ms).                     |
| `ecommerce`           | `boolean \| string`  | `false`      | Enable E-commerce data collection. Pass container name (e.g., `"dataLayer"`) if needed.       |
| `type`                | `number`             | `0`          | Counter type. `1` for Yandex Advertising Network (RSYA), `0` for standard.                    |
| `trackHash`           | `boolean`            | `false`      | Track changes in the URL hash (`#anchor`) as separate hits.                                   |
| `sendTitle`           | `boolean`            | `true`       | Send the page `<title>` with each hit.                                                        |
| `childIframe`         | `boolean`            | `false`      | Record iframe content without a counter.                                                      |
| `trustedDomains`      | `string[]`           | `undefined`  | List of trusted domains for iframe recording.                                                 |
| `params`              | `object \| any[]`    | `undefined`  | Visit parameters (session params).                                                            |
| `userParams`          | `object`             | `undefined`  | User parameters.                                                                              |
| `config`              | `Record<string,any>` | `{}`         | Any additional raw Yandex config. `defer` and `triggerEvent` are controlled by the component. |
| `debug`               | `boolean`            | `false`      | Logs init and hits to console for debugging.                                                  |
| `lazy`                | `boolean`            | `false`      | Enable lazy loading of `tag.js` (loads on first interaction or after timeout).                |
| `timeout`             | `number`             | `3500`       | Fallback timeout (ms) to auto-load script in lazy mode if there is no user interaction.       |

## 🛠 Troubleshooting

### "Yandex Metrika not initialized" warning

Ensure the `<YandexMetrika />` component is mounted on the page. The helper functions (`reachGoal`) rely on the component being present to access the global counter ID.

### AdBlockers

If you don't see events in the dashboard, check if you have an AdBlocker enabled. It often blocks `mc.yandex.ru`.

### Lazy mode enabled but no hits

If you enabled `lazy={true}` and do not see hits on fast visits, remember that the script loads on first interaction or after the timeout. For critical pages you can disable lazy mode:

```astro
<YandexMetrika counterId={12345678} lazy={false} />
```

## Author

Created by [KochGO — AI Solutions Architect](https://kochgo.ru).

## 📄 License

MIT © [KochGO](https://github.com/KochGO)
