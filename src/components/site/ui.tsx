import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function Atmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-canvas" />
      <div className="site-grid absolute inset-0 opacity-70" />
      <div className="absolute -top-40 left-1/2 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute top-40 -right-16 h-64 w-64 rounded-full bg-signal/10 blur-3xl" />
    </div>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="icon-btn shrink-0 bg-surface/80"
    >
      {isDark ? <Sun className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} /> : <Moon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} />}
    </button>
  );
}

export function SectionIndex({
  index,
  title,
  text,
}: {
  index: string;
  title: string;
  text?: string;
}) {
  return (
    <header className="mb-3">
      <div className="flex items-end gap-3">
        <p className="pb-1 text-sm font-medium text-signal">{index}</p>
        <h2 className="text-xl font-semibold tracking-tight text-balance md:text-2xl">{title}</h2>
        <span className="mb-2 hidden h-px min-w-[2rem] flex-1 bg-line sm:block" aria-hidden="true" />
      </div>
      {text ? <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{text}</p> : null}
    </header>
  );
}

export function Band({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line py-section">
      <div className="shell">{children}</div>
    </section>
  );
}

export function Reveal({
  as: Tag = 'div',
  children,
  className = '',
  delay = 0,
}: {
  as?: 'div' | 'li';
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShown(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${shown ? 'reveal-in' : ''} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
