import type { PortfolioFreelanceProjectItem } from '../../firebase/types/portfolio.types';
import { lines } from './model';
import { Brief, CoverImage, FeatureList, LiveLink, UnavailableNotice } from './projectBits';
import { Band, Reveal, SectionIndex } from './ui';

const NDA_MESSAGE = 'Private client project – details available upon request.';

export default function FreelanceSection({
  projects,
  index,
}: {
  projects: PortfolioFreelanceProjectItem[];
  index: string;
}) {
  return (
    <Band id="freelance">
      <SectionIndex index={index} title="Client work" />
      <div className="grid gap-3 md:grid-cols-2">
        {projects.map((project, i) => {
          const features = lines(project.keyFeatures);
          const liveLabel = project.isNotWorking ? 'Open live site (may be down)' : 'Open live site';
          const title = project.clientName?.trim();
          const outcome = project.resultHighlight?.trim();
          const results = project.results?.trim();
          const meta = [project.techStack?.trim(), project.timeline?.trim()].filter(Boolean).join(' · ');
          return (
            <Reveal key={i} className="h-full" delay={Math.min(i, 4) * 40}>
              <article className="panel group flex h-full flex-col overflow-hidden">
                {project.isNda ? (
                  <div className="space-y-3 p-4 md:p-5">
                    <UnavailableNotice active={project.isNotWorking} />
                    <p className="text-sm leading-relaxed text-muted">{NDA_MESSAGE}</p>
                  </div>
                ) : (
                  <div className="flex h-full flex-col gap-3 p-4">
                    <div className="flex gap-3">
                      <CoverImage layout="thumb" src={project.screenshotUrl} alt={title || project.clientType || 'Client project'} />
                      <div className="min-w-0">
                        {title ? <h3 className="text-lg font-semibold tracking-tight">{title}</h3> : null}
                        {project.clientType ? (
                          <p className={`${title ? 'mt-0.5' : ''} text-sm text-signal`}>{project.clientType}</p>
                        ) : null}
                        {meta ? <p className="mt-1 text-xs leading-relaxed text-faint">{meta}</p> : null}
                      </div>
                    </div>
                    <UnavailableNotice active={project.isNotWorking} />
                    <div className="grid gap-3">
                      {project.problem?.trim() ? <Brief label="Problem">{project.problem.trim()}</Brief> : null}
                      {project.solution?.trim() ? <Brief label="Solution">{project.solution.trim()}</Brief> : null}
                      {features.length ? (
                        <Brief label="Key features">
                          <FeatureList items={features} />
                        </Brief>
                      ) : null}
                      {(outcome || results) ? (
                        <Brief label="Results" tone="result">
                          {outcome ? <p className="font-medium">{outcome}</p> : null}
                          {results ? <p className={outcome ? 'mt-1 font-normal text-muted' : ''}>{results}</p> : null}
                        </Brief>
                      ) : null}
                    </div>
                    <div className="mt-auto pt-1">
                      <LiveLink href={project.liveLink} label={liveLabel} />
                    </div>
                  </div>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </Band>
  );
}
