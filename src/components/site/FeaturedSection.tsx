import { Github } from 'lucide-react';
import type { PortfolioFeaturedProjectItem } from '../../firebase/types/portfolio.types';
import { lines } from './model';
import { Brief, CoverImage, FeatureList, LiveLink, UnavailableNotice } from './projectBits';
import { Band, Reveal, SectionIndex } from './ui';

export default function FeaturedSection({
  projects,
  index,
}: {
  projects: PortfolioFeaturedProjectItem[];
  index: string;
}) {
  return (
    <Band id="featured">
      <SectionIndex index={index} title="Featured projects" />
      <div className="grid gap-3">
        {projects.map((project, i) => {
          const features = lines(project.keyFeatures);
          const name = project.name?.trim() || 'Featured project';
          const liveLabel = project.isNotWorking ? 'Live (may be down)' : 'Live';
          const problem = project.problem?.trim() || '';
          const outcome = project.resultHighlight?.trim() || '';
          const headerLead = outcome
            ? { label: 'Results', tone: 'result' as const, text: outcome }
            : problem
              ? { label: 'Problem', tone: 'plain' as const, text: problem }
              : null;
          const problemBelow = headerLead?.label === 'Results' ? problem : '';
          const hasNotes = Boolean(
            problemBelow ||
            project.solution?.trim() ||
            project.architectureThinking?.trim() ||
            features.length
          );
          return (
            <Reveal key={`${project.name ?? 'featured'}-${i}`} delay={Math.min(i, 3) * 50}>
              <article className="panel group p-4 md:p-5">
                <div className="flex min-w-0 flex-col gap-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_18rem] sm:items-start">
                    <div className="min-w-0 sm:col-start-1 sm:row-start-1">
                      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                        <div className="min-w-0">
                          {project.name ? (
                            <h3 className="text-xl font-semibold tracking-tight">{project.name}</h3>
                          ) : null}
                          {project.isNotWorking ? (
                            <div className="mt-2">
                              <UnavailableNotice active />
                            </div>
                          ) : null}
                        </div>
                        {(project.githubLink || project.liveLink) ? (
                          <div className="flex flex-wrap items-center gap-3">
                            {project.githubLink ? (
                              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1.5 text-sm">
                                <Github className="h-4 w-4" aria-hidden="true" />
                                GitHub
                              </a>
                            ) : null}
                            <LiveLink href={project.liveLink} label={liveLabel} />
                          </div>
                        ) : null}
                      </div>
                    </div>
                    {project.screenshotUrl?.trim() ? (
                      <div className="sm:col-start-2 sm:row-start-1 sm:row-span-2">
                        <CoverImage layout="aside" src={project.screenshotUrl} alt={name} />
                      </div>
                    ) : null}
                    {headerLead ? (
                      <div className="sm:col-start-1 sm:row-start-2">
                        <Brief label={headerLead.label} tone={headerLead.tone}>{headerLead.text}</Brief>
                      </div>
                    ) : null}
                  </div>
                  {hasNotes ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {problemBelow ? <Brief label="Problem">{problemBelow}</Brief> : null}
                      {project.solution?.trim() ? <Brief label="Solution">{project.solution.trim()}</Brief> : null}
                      {project.architectureThinking?.trim() ? (
                        <div className="sm:col-span-2">
                          <Brief label="Architecture">{project.architectureThinking.trim()}</Brief>
                        </div>
                      ) : null}
                      {features.length ? (
                        <div className="sm:col-span-2">
                          <Brief label="Key features">
                            <FeatureList items={features} />
                          </Brief>
                        </div>
                      )  : null}
                    </div>
                  ) : null}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Band>
  );
}
