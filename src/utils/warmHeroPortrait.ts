const warmed = new Map<string, HTMLImageElement>();

/** Start the visible portrait before the hero paints, and keep the request alive across remounts. */
export function warmHeroPortrait(url?: string, priority: 'high' | 'low' = 'high'): void {
  const href = url?.trim();
  if (!href || typeof document === 'undefined') return;

  const image = warmed.get(href);
  if (!image) {
    const next = new Image();
    next.decoding = priority === 'high' ? 'sync' : 'async';
    next.setAttribute('fetchpriority', priority);
    next.src = href;
    warmed.set(href, next);
  } else if (priority === 'high') {
    image.setAttribute('fetchpriority', 'high');
  }

  if (priority !== 'high') return;

  const current = document.querySelector('link[data-hero-portrait]');
  if (current?.getAttribute('href') === href) return;
  current?.remove();

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = href;
  link.setAttribute('fetchpriority', 'high');
  link.setAttribute('data-hero-portrait', '');
  document.head.appendChild(link);
}
