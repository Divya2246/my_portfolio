import type { PortfolioEducationItem } from '../../firebase/types/portfolio.types';
import { Band, Reveal, SectionIndex } from './ui';

export default function EducationSection({
  education,
  index,
}: {
  education: PortfolioEducationItem[];
  index: string;
}) {
  return (
    <Band id="education">
      <SectionIndex index={index} title="Education" />
      <ol className="timeline">
        {education.map((item, i) => {
          const place = [item.institution, item.location].filter(Boolean).join(' · ');
          return (
            <Reveal key={`${item.degree}-${i}`} as="li" className="panel relative px-4 py-3" delay={Math.min(i, 4) * 40}>
                <span className="timeline-mark" aria-hidden="true" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-base font-semibold">{item.degree}</h3>
                  {item.period ? <p className="text-xs text-faint">{item.period}</p> : null}
                </div>
                {place ? <p className="mt-1 text-sm leading-snug text-muted">{place}</p> : null}
                {item.grade ? <p className="mt-1 text-xs text-signal">{item.grade}</p> : null}
            </Reveal>
          );
        })}
      </ol>
    </Band>
  );
}
