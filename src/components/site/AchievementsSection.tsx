import { filled } from './model';
import { Band, Reveal, SectionIndex } from './ui';

export default function AchievementsSection({
  achievements,
  index,
}: {
  achievements: string[];
  index: string;
}) {
  const items = filled(achievements);
  if (!items.length) return null;

  return (
    <Band id="achievements">
      <SectionIndex index={index} title="Achievements" />
      <ul className="grid gap-2 md:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={`${item}-${i}`} as="li" className="panel flex gap-3 px-4 py-3" delay={Math.min(i, 5) * 35}>
            <span className="text-xs font-medium text-signal">{String(i + 1).padStart(2, '0')}</span>
            <p className="text-sm leading-snug text-muted">{item}</p>
          </Reveal>
        ))}
      </ul>
    </Band>
  );
}
