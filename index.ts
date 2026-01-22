import YandexMetrika from './src/YandexMetrika.astro';

// Extend the global Window object
declare global {
  interface Window {
    ym: (id: number | string, method: string, ...args: any[]) => void;
    _astro_ym_id?: number | string;
  }
}

/**
 * Send a Goal (Conversion)
 * @param target Goal identifier (string)
 * @param params Visit parameters (object, optional)
 * @param counterId Counter ID (optional, uses the initialized ID by default)
 * 
 * @example
 * reachGoal('purchase', { price: 1000, currency: 'RUB' });
 */
export function reachGoal(
  target: string,
  params?: Record<string, any>,
  counterId?: number | string
) {
  const id = counterId || window._astro_ym_id;

  if (typeof window !== 'undefined' && typeof window.ym === 'function' && id) {
    window.ym(id, 'reachGoal', target, params);
  } else if (import.meta.env.DEV) {
    console.warn(`[astro-ym] reachGoal('${target}') Yandex Metrika not initialized or ID is missing.`);
  }
}

/**
 * Manually send a Page View (Hit)
 */
export function hit(
  url: string,
  options?: { title?: string; referer?: string; params?: object },
  counterId?: number | string
) {
  const id = counterId || window._astro_ym_id;

  if (typeof window !== 'undefined' && typeof window.ym === 'function' && id) {
    window.ym(id, 'hit', url, options);
  }
}

// Export component
export { YandexMetrika };
export default YandexMetrika;