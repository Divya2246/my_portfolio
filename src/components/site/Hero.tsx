import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import type { PortfolioData } from '../../firebase/types/portfolio.types';
import { warmHeroPortrait } from '../../utils/warmHeroPortrait';
import { opensInNewTab, sectionVisible } from './model';

const PORTRAIT_HOLD_MS = 15000;
const PORTRAIT_FLIP_MS = 340;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || '•';
}

function heroLead(data: PortfolioData): string | undefined {
  const positioning = data.positioningLine?.trim();
  if (positioning) return positioning;
  const summary = data.professionalSummary?.trim();
  if (!summary) return undefined;
  const line = summary.split('\n').map((item) => item.trim()).find(Boolean);
  if (!line) return undefined;
  return line.length > 180 ? `${line.slice(0, 177).trimEnd()}…` : line;
}

function portraitSources(data: PortfolioData): string[] {
  const listed = Array.isArray(data.avatarUrls)
    ? data.avatarUrls.map((url) => (typeof url === 'string' ? url.trim() : '')).filter(Boolean)
    : [];
  if (listed.length) return listed;
  const single = data.avatarUrl?.trim();
  return single ? [single] : [];
}

function PortraitFace({
  name,
  src,
  priority,
  onReady,
}: {
  name: string;
  src: string;
  priority: boolean;
  onReady: () => void;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-[4/5] max-h-[19rem] items-center justify-center bg-elevated text-5xl font-semibold text-faint">
        {initials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      width={640}
      height={800}
      className="aspect-[4/5] max-h-[19rem] w-full object-cover"
      draggable={false}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'low'}
      onLoad={onReady}
      onError={() => setFailed(true)}
    />
  );
}

function Portrait({ name, sources }: { name: string; sources: string[] }) {
  const [index, setIndex] = useState(0);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const current = sources[index] ?? sources[0];

  const warmNext = () => {
    if (sources.length < 2) return;
    const next = sources[(indexRef.current + 1) % sources.length];
    if (next) warmHeroPortrait(next, 'low');
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || sources.length === 0) return undefined;

    const ring = ringRef.current;
    const card = cardRef.current;
    if (!ring || !card) return undefined;

    let frame = 0;
    let elapsed = 0;
    let last = performance.now();
    let stopped = false;
    const timers = new Set<number>();

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = window.setTimeout(() => {
          timers.delete(timer);
          resolve();
        }, ms);
        timers.add(timer);
      });

    const setSweep = (amount: number) => {
      ring.style.setProperty('--sweep', `${Math.max(0, Math.min(1, amount)) * 360}deg`);
    };

    const paintRing = () =>
      new Promise<void>((resolve) => {
        const step = (now: number) => {
          if (stopped) {
            resolve();
            return;
          }
          elapsed += now - last;
          last = now;
          const amount = elapsed / PORTRAIT_HOLD_MS;
          setSweep(amount);
          if (amount < 1) {
            frame = requestAnimationFrame(step);
            return;
          }
          setSweep(1);
          resolve();
        };
        last = performance.now();
        frame = requestAnimationFrame(step);
      });

    const flipToNext = async () => {
      card.style.transition = `transform ${PORTRAIT_FLIP_MS}ms ease-in`;
      card.style.transform = 'rotateY(90deg)';
      await wait(PORTRAIT_FLIP_MS);
      if (stopped) return;
      const next = (indexRef.current + 1) % sources.length;
      indexRef.current = next;
      flushSync(() => setIndex(next));
      card.style.transition = 'none';
      card.style.transform = 'rotateY(-90deg)';
      void card.offsetHeight;
      card.style.transition = `transform ${PORTRAIT_FLIP_MS}ms ease-out`;
      card.style.transform = 'rotateY(0deg)';
      await wait(PORTRAIT_FLIP_MS);
    };

    const loop = async () => {
      while (!stopped) {
        elapsed = 0;
        setSweep(0);
        await paintRing();
        if (stopped) return;
        if (sources.length > 1) {
          await flipToNext();
          if (stopped) return;
        }
      }
    };

    indexRef.current = 0;
    setIndex(0);
    loop();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [sources]);

  if (!current) return null;

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-3 z-20 h-6 w-6 border-l border-t border-signal" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-3 right-3 z-20 h-6 w-6 border-b border-r border-signal/70" aria-hidden="true" />
      <div
        ref={ringRef}
        className="portrait-ring rounded-3xl p-1 shadow-[var(--shadow)]"
      >
        <div className="[perspective:1100px]">
          <div
            ref={cardRef}
            className="overflow-hidden rounded-[calc(1.5rem-4px)] bg-elevated [backface-visibility:hidden] [transform-style:preserve-3d]"
          >
            <PortraitFace key={current} name={name} src={current} priority={index === 0} onReady={warmNext} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ data }: { data: PortfolioData }) {
  const lead = heroLead(data);
  const ctaLink = data.heroCtaLink?.trim();
  const ctaLabel = data.heroCtaText?.trim() || (ctaLink ? 'Book a call' : '');
  const stats = [
    data.yearsOfExperience?.trim() ? { label: 'Experience', value: data.yearsOfExperience.trim() } : null,
    data.projectsCompletedCount?.trim() ? { label: 'Projects shipped', value: data.projectsCompletedCount.trim() } : null,
    data.clientsServedCount?.trim() ? { label: 'Clients', value: data.clientsServedCount.trim() } : null,
  ].filter((stat): stat is { label: string; value: string } => !!stat);
  const portraits = useMemo(() => portraitSources(data), [data]);
  const showPortrait = portraits.length > 0;

  return (
    <section className="pb-4 pt-[calc(4.75rem+env(safe-area-inset-top))] md:pb-5">
      <div className="shell">
        <div className={`stage grid items-center gap-5 ${showPortrait ? 'lg:grid-cols-12 lg:gap-6' : ''}`}>
          <div className={showPortrait ? 'lg:col-span-7' : ''}>
            {data.title ? (
              <p className="mb-3 flex items-center gap-3 text-sm text-muted md:text-base">
                <span className="h-px w-8 bg-signal" aria-hidden="true" />
                {data.title}
              </p>
            ) : null}
            <h1 className="hero-name max-w-5xl break-words text-display-hero font-semibold text-balance">{data.fullName}</h1>
            {lead ? <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{lead}</p> : null}
            {stats.length ? (
              <dl className="mt-4 flex flex-wrap gap-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="min-w-[7.5rem] rounded-xl border border-line bg-canvas/50 px-3 py-2">
                    <dt className="text-xs text-faint">{stat.label}</dt>
                    <dd className="mt-1 text-lg font-semibold tracking-tight">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {ctaLink && ctaLabel ? (
                <a
                  href={ctaLink}
                  className="btn btn-primary"
                  {...(opensInNewTab(ctaLink) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {ctaLabel}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : null}
              {data.resumePdfUrl && sectionVisible(data.sectionVisibility, 'resume') ? (
                <a href={data.resumePdfUrl} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                  Resume
                </a>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.email ? (
                <a href={`mailto:${data.email}`} className="icon-btn" aria-label={`Email ${data.fullName}`}>
                  <Mail className="h-4 w-4" strokeWidth={1.75} />
                </a>
              ) : null}
              {data.github ? (
                <a href={data.github} className="icon-btn" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-4 w-4" strokeWidth={1.75} />
                </a>
              ) : null}
              {data.linkedin ? (
                <a href={data.linkedin} className="icon-btn" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" strokeWidth={1.75} />
                </a>
              ) : null}
            </div>
          </div>
          {showPortrait ? (
            <div className="mx-auto w-full max-w-[17rem] lg:col-span-5 lg:mx-0 lg:justify-self-end">
              <Portrait name={data.fullName} sources={portraits} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
