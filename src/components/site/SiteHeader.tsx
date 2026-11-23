import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { NavItem } from './model';
import { ThemeToggle } from './ui';

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '');
  const key = ids.join('|');

  useEffect(() => {
    const elements = key
      .split('|')
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visible[0]?.target.id;
        if (id) setActive(id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.15, 0.4] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

export default function SiteHeader({ name, items }: { name: string; items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(items.map((item) => item.id));

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b border-line/80 bg-canvas/80 backdrop-blur-md"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <div className="shell flex h-16 items-center gap-3">
        <a href="#top" className="min-w-0 max-w-[46%] truncate text-sm font-semibold tracking-tight md:max-w-[14rem]">
          {name}
        </a>
        <nav className="nav-scroll hidden min-w-0 flex-1 overflow-x-auto lg:block" aria-label="Sections">
          <div className="flex w-max min-w-full items-center justify-end gap-5">
            {items.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={`shrink-0 py-2 text-sm transition-colors ${isActive ? 'text-ink' : 'text-faint hover:text-ink'}`}
                >
                  <span className="block">{item.label}</span>
                  <span className={`mt-1 block h-px ${isActive ? 'bg-accent' : 'bg-transparent'}`} />
                </a>
              );
            })}
          </div>
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          {items.length > 0 ? (
          <button
            type="button"
            className="icon-btn bg-surface/80 lg:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
          ) : null}
        </div>
      </div>
      <div className="signal-line" aria-hidden="true" />
      {open ? (
        <nav id="site-menu" className="border-t border-line bg-canvas lg:hidden" aria-label="Sections">
          <div className="shell flex flex-col py-2">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? 'location' : undefined}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center justify-between border-b border-line/80 text-base text-ink"
              >
                <span>{item.label}</span>
                <span className="text-sm text-faint">{item.index}</span>
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
