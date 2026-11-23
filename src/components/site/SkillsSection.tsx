import type { PortfolioData } from '../../firebase/types/portfolio.types';
import { Band, Reveal, SectionIndex } from './ui';

export default function SkillsSection({ data, index }: { data: PortfolioData; index: string }) {
  const categories = data.skillCategories ?? [];
  const skills = data.skills ?? [];
  const useCategories = categories.length > 0;

  return (
    <Band id="skills">
      <SectionIndex index={index} title="Skills" />
      {useCategories ? (
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, i) => (
            <Reveal key={`${category.category}-${i}`} delay={Math.min(i, 5) * 35}>
              <article className="panel px-4 py-3">
                <h3 className="text-sm font-semibold tracking-tight">{category.category}</h3>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {(category.skills ?? []).filter((skill) => skill.trim()).map((skill, j) => (
                    <li key={`${skill}-${j}`} className="chip">{skill}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {skills.map((skill, i) => {
            const amount = skill.percentage;
            const width = amount == null ? 0 : Math.max(0, Math.min(100, amount));
            return (
              <Reveal key={`${skill.name}-${i}`} as="li" className="panel px-4 py-3" delay={Math.min(i, 6) * 25}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm text-ink">{skill.name}</span>
                    {amount != null ? <span className="text-sm text-signal">{amount}%</span> : null}
                  </div>
                  {amount != null ? (
                    <div className="mt-2 h-px bg-line" aria-hidden="true">
                      <div className="h-px bg-accent" style={{ width: `${width}%` }} />
                    </div>
                  ) : null}
              </Reveal>
            );
          })}
        </ul>
      )}
    </Band>
  );
}
