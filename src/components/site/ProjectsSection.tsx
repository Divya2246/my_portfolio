import type { PortfolioProjectItem } from '../../firebase/types/portfolio.types';
import { lines } from './model';
import { Brief, CoverImage, LiveLink, ResultPill, UnavailableNotice } from './projectBits';
import { Band, Reveal, SectionIndex } from './ui';

function techParts(tech?: string): string[] | null {
  const value = tech?.trim();
  if (!value) return null;
  const parts = value.split(',').map((part) => part.trim()).filter(Boolean);
  if (parts.length > 1 && parts.every((part) => part.length <= 36)) return parts;
  return null;
}

function ProjectCard({ project, indexLabel }: { project: PortfolioProjectItem; indexLabel: string }) {
  const highlights = lines(project.highlights);
  const chips = techParts(project.tech);
  const cover = project.screenshotUrl?.trim() || project.imageUrl?.trim();
  const linkLabel = project.isNotWorking ? 'View project (may be down)' : 'View project';

  return (
    <article className="panel group flex h-full flex-col gap-3 p-4">
      <div className="flex gap-3">
        <CoverImage layout="thumb" src={cover} alt={project.name} />
        <div className="min-w-0">
          <p className="text-xs font-medium text-signal">{indexLabel}</p>
          <h3 className="mt-0.5 text-lg font-semibold tracking-tight">{project.name}</h3>
          <div className="mt-2">
            <ResultPill value={project.resultHighlight} />
          </div>
        </div>
      </div>
      <UnavailableNotice active={project.isNotWorking} />
      {chips ? (
        <ul className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <li key={chip} className="chip">{chip}</li>
          ))}
        </ul>
      ) : project.tech?.trim() ? (
        <p className="text-sm leading-snug text-faint">{project.tech.trim()}</p>
      ) : null}
      {highlights.length ? (
        <Brief label="Highlights">
          <ul className="space-y-1">
            {highlights.map((highlight, i) => (
              <li key={i}>{highlight}</li>
            ))}
          </ul>
        </Brief>
      ) : null}
      <div className="mt-auto">
        <LiveLink href={project.url} label={linkLabel} />
      </div>
    </article>
  );
}

export default function ProjectsSection({
  projects,
  index,
}: {
  projects: PortfolioProjectItem[];
  index: string;
}) {
  return (
    <Band id="projects">
      <SectionIndex index={index} title="Projects" />
      <div className="grid gap-3 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={`${project.name}-${i}`} className="h-full" delay={Math.min(i, 4) * 40}>
            <ProjectCard project={project} indexLabel={String(i + 1).padStart(2, '0')} />
          </Reveal>
        ))}
      </div>
    </Band>
  );
}
