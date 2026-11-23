import type { PortfolioData } from '../../firebase/types/portfolio.types';
import { detailedServices, filled } from './model';
import { Brief } from './projectBits';
import { Band, Reveal, SectionIndex } from './ui';

export default function ServicesSection({ data, index }: { data: PortfolioData; index: string }) {
  const detailed = detailedServices(data);
  const simple = filled(data.services);

  if (detailed.length) {
    return (
      <Band id="services">
        <SectionIndex index={index} title="Services" />
        <div className="grid gap-3 md:grid-cols-2">
          {detailed.map((service, i) => (
            <Reveal key={`${service.title}-${i}`} className="h-full" delay={Math.min(i, 4) * 40}>
              <article className="panel flex h-full flex-col gap-3 p-4">
                <h3 className="text-base font-semibold tracking-tight">{service.title?.trim()}</h3>
                {service.description?.trim() ? (
                  <p className="whitespace-pre-line text-sm leading-snug text-muted">{service.description.trim()}</p>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-2">
                  {service.problemItSolves?.trim() ? <Brief label="Problem">{service.problemItSolves.trim()}</Brief> : null}
                  {service.whoItIsFor?.trim() ? <Brief label="For">{service.whoItIsFor.trim()}</Brief> : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Band>
    );
  }

  if (!simple.length) return null;

  return (
    <Band id="services">
      <SectionIndex index={index} title="Services" />
      <ol className="grid gap-2 sm:grid-cols-2">
        {simple.map((service, i) => (
          <Reveal key={`${service}-${i}`} as="li" className="panel flex gap-3 px-4 py-3" delay={Math.min(i, 5) * 30}>
            <span className="text-xs font-medium text-signal">{String(i + 1).padStart(2, '0')}</span>
            <p className="text-sm font-medium leading-snug text-ink">{service}</p>
          </Reveal>
        ))}
      </ol>
    </Band>
  );
}
