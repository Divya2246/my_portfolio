import { ArrowUpRight } from 'lucide-react';
import type { PortfolioExperienceItem, PortfolioExperienceProject } from '../../firebase/types/portfolio.types';
import { lines } from './model';
import { Band, Reveal, SectionIndex } from './ui';

function Detail({ label, value }: { label: string; value?: string }) {
  const text = value?.trim();
  if (!text) return null;
  return (
    <div className="min-w-0">
      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-faint">{label}</dt>
      <dd className="mt-1 text-sm leading-snug text-muted">{text}</dd>
    </div>
  );
}

function OrgProject({ project }: { project: PortfolioExperienceProject }) {
  const name = project.name.trim();
  const url = project.url?.trim();
  const summary = project.summary?.trim();
  const contribution = project.contribution?.trim();
  const tech = project.techStack?.trim();
  const impact = project.impact?.trim();

  return (
    <li className="rounded-xl border border-line bg-canvas/40 px-3 py-2.5">
      {name ? (
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
            {name}
            <ArrowUpRight className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
          </a>
        ) : (
          <p className="text-sm font-semibold text-ink">{name}</p>
        )
      ) : null}
       {summary ? (
        <p className="mt-1 text-sm leading-snug text-muted">
          <span className="text-ink">Project Summary - </span>
          {summary}
        </p>
      ) : null}
      {contribution ? (
        <p className="mt-1 text-sm leading-snug text-muted">
          <span className="text-ink">My Contribution - </span>
          {contribution}
        </p>
      ) : null}
      {tech ? <p className="mt-1 text-xs leading-snug text-faint">{tech}</p> : null}
      {impact ? <p className="mt-1.5 text-sm font-medium leading-snug text-signal">{impact}</p> : null}
    </li>
  );
}

function OrgProjects({ projects }: { projects?: PortfolioExperienceProject[] }) {
  const items = (projects ?? []).filter((project) =>
    [project.name, project.summary, project.contribution, project.techStack, project.impact, project.url].some((value) => value?.trim())
  );
  if (!items.length) return null;

  return (
    <div className="mt-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-faint">Projects</p>
      <ul className="mt-2 grid gap-2 md:grid-cols-2">
        {items.map((project, index) => (
          <OrgProject key={`${project.name}-${index}`} project={project} />
        ))}
      </ul>
    </div>
  );
}

function Role({ exp }: { exp: PortfolioExperienceItem }) {
  const points = lines(exp.points);
  return (
    <>
      <span className="timeline-mark" aria-hidden="true" />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight md:text-xl">{exp.role}</h3>
          {exp.company ? <p className="text-sm text-accent">{exp.company}</p> : null}
        </div>
        {(exp.period || exp.location) ? (
          <p className="text-xs text-faint">{[exp.period, exp.location].filter(Boolean).join(' · ')}</p>
        ) : null}
      </div>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <Detail label="Tech" value={exp.techStack} />
        <Detail label="Systems" value={exp.systemsBuilt} />
        <Detail label="Performance" value={exp.performanceImprovements} />
        <Detail label="Components" value={exp.reusableComponents} />
      </dl>
      {exp.impact?.trim() ? (
        <p className="mt-3 rounded-xl border border-signal/30 bg-signal/5 px-3 py-2 text-sm leading-snug text-ink">
          <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-signal">Impact</span>
          {exp.impact.trim()}
        </p>
      ) : null}
      {points.length ? (
        <ul className="mt-3 grid gap-x-4 gap-y-1.5 text-sm leading-snug text-muted md:grid-cols-2">
          {points.map((point, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <OrgProjects projects={exp.projects} />
    </>
  );
}

export default function ExperienceSection({
  experience,
  index,
}: {
  experience: PortfolioExperienceItem[];
  index: string;
}) {
  return (
    <Band id="experience">
      <SectionIndex index={index} title="Experience" />
      <ol className="timeline">
        {experience.map((exp, i) => (
          <Reveal key={`${exp.role}-${i}`} as="li" className="panel relative p-4" delay={Math.min(i, 4) * 50}>
            <Role exp={exp} />
          </Reveal>
        ))}
      </ol>
    </Band>
  );
}
