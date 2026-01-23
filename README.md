# astro-ym

[![npm version](https://img.shields.io/npm/v/astro-ym.svg?style=flat-square)](https://www.npmjs.com/package/astro-ym)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

**Lightweight, type-safe Yandex Metrika integration for Astro.**

Designed for **Astro 4+** and **Astro 5+** (supports both **View Transitions** and the new **Client Router**). It handles SPA navigation correctly out of the box, eliminating duplicate hits and ensuring accurate tracking.

## ✨ Features

- 🚀 **Client Router Support:** Automatically tracks page views on route changes (SPA navigation) using `astro:page-load`.
- ⚡ **Zero Config:** Smart defaults (Webvisor, Clickmap, Link tracking enabled by default).
- 🛡 **TypeScript:** Fully typed component and helper functions.
- 🎯 **Goals Helper:** Exported `reachGoal` function for easy conversion tracking.
- 🪶 **Lightweight:** Uses the modern Yandex tag.js structure.

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

| Prop                  | Type                | Default      | Description                                                                             |
| :-------------------- | :------------------ | :----------- | :-------------------------------------------------------------------------------------- |
| `counterId`           | `number \| string`  | **Required** | Your Yandex Metrika Counter ID.                                                         |
| `ssr`                 | `boolean`           | `true`       | Helps Yandex detect initial server-side load correctly.                                 |
| `webvisor`            | `boolean`           | `false`      | Enables Webvisor (session recording).                                                   |
| `clickmap`            | `boolean`           | `true`       | Enables Click map.                                                                      |
| `trackLinks`          | `boolean`           | `true`       | Tracks external link clicks.                                                            |
| `accurateTrackBounce` | `boolean \| number` | `true`       | Accurate bounce rate tracking.                                                          |
| `ecommerce`           | `boolean \| string` | `false`      | Enable E-commerce data collection. Pass container name (e.g., `"dataLayer"`) if needed. |
| `params`              | `object`            | `undefined`  | Session parameters.                                                                     |
| `userParams`          | `object`            | `undefined`  | User parameters.                                                                        |
| `debug`               | `boolean`           | `false`      | Logs hits and inits to console for debugging.                                           |

## 🛠 Troubleshooting

### "Yandex Metrika not initialized" warning

Ensure the `<YandexMetrika />` component is mounted on the page. The helper functions (`reachGoal`) rely on the component being present to access the global counter ID.

### AdBlockers

If you don't see events in the dashboard, check if you have an AdBlocker enabled. It often blocks `mc.yandex.ru`.

## Author

Created by [KochGO — AI Solutions Architect](https://kochgo.ru).

## 📄 License

MIT © [KochGO](https://github.com/KochGO)
