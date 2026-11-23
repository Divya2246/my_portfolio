import { filled } from './model';
import { Band, Reveal, SectionIndex } from './ui';

export default function ProcessSection({ steps, index }: { steps: string[]; index: string }) {
  const items = filled(steps);
  if (!items.length) return null;

  return (
    <Band id="process">
      <SectionIndex index={index} title="Process" />
      <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((step, i) => (
          <Reveal key={`${step}-${i}`} as="li" className="panel flex h-full items-start gap-3 px-3 py-3" delay={Math.min(i, 5) * 40}>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-signal/40 text-xs font-medium text-signal">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="text-sm font-medium leading-snug text-ink">{step}</p>
          </Reveal>
        ))}
      </ol>
    </Band>
  );
}
