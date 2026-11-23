import { useState, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

export function CoverImage({
  src,
  alt,
  layout = 'banner',
}: {
  src?: string;
  alt: string;
  layout?: 'banner' | 'thumb' | 'aside';
}) {
  const [failed, setFailed] = useState(false);
  const url = src?.trim();
  if (!url || failed) return null;

  const frame = layout === 'thumb'
    ? 'shot relative h-[4.5rem] w-[7.25rem] shrink-0 overflow-hidden rounded-lg bg-elevated'
    : layout === 'aside'
      ? 'shot relative h-36 w-full overflow-hidden rounded-xl bg-elevated sm:h-40'
      : 'shot relative h-36 w-full overflow-hidden bg-elevated sm:h-40';

  return (
    <div className={frame}>
      <img
        src={url}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
    </div>
  );
}

export function ResultPill({ value }: { value?: string }) {
  const text = value?.trim();
  if (!text) return null;
  return <p className="chip border-signal/40 text-signal">{text}</p>;
}

export function Brief({
  label,
  children,
  tone = 'plain',
}: {
  label: string;
  children?: ReactNode;
  tone?: 'plain' | 'result';
}) {
  if (children == null || children === false || children === '') return null;
  const result = tone === 'result';
  return (
    <div className={result ? 'rounded-xl border border-signal/30 bg-signal/5 px-3 py-2' : 'min-w-0'}>
      <p className={`text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${result ? 'text-signal' : 'text-faint'}`}>
        {label}
      </p>
      <div className={`mt-1 text-sm leading-snug ${result ? 'text-ink' : 'text-muted'}`}>{children}</div>
    </div>
  );
}

export function FeatureList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="grid gap-1 sm:grid-cols-2">
      {items.map((feature, index) => (
        <li key={`${feature}-${index}`} className="flex gap-2 text-sm leading-snug text-muted">
          <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

export function UnavailableNotice({ active }: { active?: boolean }) {
  if (!active) return null;
  return (
    <div className="space-y-1">
      <p className="inline-flex rounded-full border border-danger/40 bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
        Currently not working
      </p>
      <p className="text-sm text-muted">The live demo is currently unavailable.</p>
    </div>
  );
}

export function LiveLink({ href, label }: { href?: string; label: string }) {
  const url = href?.trim();
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1.5 text-sm">
      {label}
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
