import type { PortfolioData } from '../../firebase/types/portfolio.types';
import { Band, SectionIndex } from './ui';

export default function AboutSection({ data, index }: { data: PortfolioData; index: string }) {
  const facts = [
    data.yearsOfExperience?.trim() ? { label: 'Experience', value: data.yearsOfExperience.trim() } : null,
    data.specialization?.trim() ? { label: 'Specialization', value: data.specialization.trim() } : null,
    data.clientTypes?.trim() ? { label: 'Clients', value: data.clientTypes.trim() } : null,
  ].filter((fact): fact is { label: string; value: string } => !!fact);

  const hasNarrative = Boolean(data.professionalSummary?.trim() || data.fullTimeFreelanceMention?.trim());

  return (
    <Band id="about">
      <SectionIndex index={index} title="About" />
      <div className="grid gap-3 lg:grid-cols-12">
        {hasNarrative ? (
        <div className={`panel space-y-3 p-4 ${facts.length ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          {data.professionalSummary?.trim() ? (
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink md:text-base">
              {data.professionalSummary.trim()}
            </p>
          ) : null}
          {data.fullTimeFreelanceMention?.trim() ? (
            <p className="border-l-2 border-accent pl-3 text-sm leading-relaxed text-ink md:text-base">
              {data.fullTimeFreelanceMention.trim()}
            </p>
          ) : null}
        </div>
        ) : null}
        {facts.length ? (
          <dl className={`grid gap-3 sm:grid-cols-2 ${hasNarrative ? 'lg:col-span-5 lg:grid-cols-1' : 'lg:col-span-12 lg:grid-cols-3'}`}>
            {facts.map((fact) => (
              <div key={fact.label} className="panel px-4 py-3">
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-signal">{fact.label}</dt>
                <dd className="mt-1 text-sm leading-snug text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </Band>
  );
}
