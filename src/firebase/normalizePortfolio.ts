import { PORTFOLIO_SECTION_KEYS } from './types/portfolio.types';
import type {
  PortfolioData,
  PortfolioEducationItem,
  PortfolioExperienceItem,
  PortfolioExperienceProject,
  PortfolioFaqItem,
  PortfolioFeaturedProjectItem,
  PortfolioFreelanceProjectItem,
  PortfolioMediaFileType,
  PortfolioMediaItem,
  PortfolioProjectItem,
  PortfolioSectionKey,
  PortfolioSectionVisibility,
  PortfolioServiceDetail,
  PortfolioSkillCategory,
  PortfolioSkillItem,
  PortfolioTestimonialItem,
} from './types/portfolio.types';

/**
 * Read a `portfolios/{userId}` document the way visitors should see it.
 *
 * Import replaces the whole document and drops empty cards. A normal form save
 * does not. This reader applies those same content rules, and it treats
 * showWIPBanner, isNda, and isNotWorking as real booleans.
 */

function text(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

/** Blank, "false", and "no" are false. Only a real yes is true. */
function portfolioFlag(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  const normalized = text(value).toLowerCase();
  return normalized === 'true' || normalized === 'yes' || normalized === '1';
}

function percentage(value: unknown): number | undefined {
  if (value == null || value === '') return undefined;
  const number = typeof value === 'number' ? value : Number(text(value));
  return Number.isFinite(number) ? number : undefined;
}

/** Skill category cells may be a string list, or one cell split with `|`. */
function portfolioStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => text(item)).filter(Boolean);
  const raw = text(value);
  if (!raw) return [];
  const parts = raw.includes('|') || raw.includes('\n') ? raw.split(/\||\n/) : raw.split(',');
  return parts.map((part) => part.trim()).filter(Boolean);
}

function hasContent(values: unknown[]): boolean {
  return values.some((value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return Number.isFinite(value);
    return text(value) !== '';
  });
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asItems<T>(value: unknown, map: (row: Record<string, unknown>) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  const items: T[] = [];
  value.forEach((item) => {
    const row = asRecord(item);
    if (!row) return;
    const mapped = map(row);
    if (mapped) items.push(mapped);
  });
  return items;
}

function labeledList(value: unknown): string[] {
  if (value == null || value === '') return [];
  if (typeof value === 'string') return portfolioStringList(value);
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === 'string' || typeof item === 'number') return text(item);
      const row = asRecord(item);
      if (row && 'text' in row) return text(row.text);
      return '';
    })
    .filter(Boolean);
}

function skills(value: unknown): PortfolioSkillItem[] {
  if (!Array.isArray(value)) return [];
  const list: PortfolioSkillItem[] = [];
  value.forEach((item) => {
    if (typeof item === 'string' || typeof item === 'number') {
      const name = text(item);
      if (name) list.push({ name });
      return;
    }
    const row = asRecord(item);
    if (!row) return;
    const name = text(row.name);
    if (!name) return;
    const amount = percentage(row.percentage);
    list.push(amount === undefined ? { name } : { name, percentage: amount });
  });
  return list;
}

function fileType(value: unknown): PortfolioMediaFileType | undefined {
  const type = text(value).toLowerCase();
  if (type === 'image' || type === 'pdf' || type === 'video') return type;
  return undefined;
}

const SECTION_NAMES = new Set<string>(PORTFOLIO_SECTION_KEYS);

function visibilityFlag(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return normalized === 'true' || normalized === 'yes' || normalized === '1';
}

function sectionVisibility(value: unknown): PortfolioSectionVisibility {
  const entries: [string, unknown][] = [];
  if (Array.isArray(value)) {
    value.forEach((item) => {
      const row = asRecord(item);
      if (!row) return;
      const name = text(row.section ?? row.name ?? row.key);
      if (name) entries.push([name, row.visible ?? row.value]);
    });
  } else {
    const record = asRecord(value);
    if (record) Object.entries(record).forEach(([name, flag]) => entries.push([name, flag]));
  }

  const visibility: PortfolioSectionVisibility = {};
  entries.forEach(([name, flag]) => {
    if (!SECTION_NAMES.has(name)) return;
    const parsed = visibilityFlag(flag);
    if (parsed !== undefined) visibility[name as PortfolioSectionKey] = parsed;
  });
  return visibility;
}

function portraits(source: Record<string, unknown>): { avatarUrl: string; avatarUrls: string[] } {
  const listed = portfolioStringList(source.avatarUrls);
  const single = text(source.avatarUrl);
  const avatarUrls = listed.length > 0 ? listed : single ? [single] : [];
  return { avatarUrl: avatarUrls[0] ?? '', avatarUrls };
}

export function normalizePortfolio(input: unknown): PortfolioData {
  const source = asRecord(input) ?? {};
  const photos = portraits(source);

  return {
    fullName: text(source.fullName),
    title: text(source.title),
    email: text(source.email),
    phone: text(source.phone),
    whatsapp: text(source.whatsapp),
    location: text(source.location),
    avatarUrl: photos.avatarUrl,
    avatarUrls: photos.avatarUrls,
    heroCtaText: text(source.heroCtaText),
    heroCtaLink: text(source.heroCtaLink),
    projectsCompletedCount: text(source.projectsCompletedCount),
    clientsServedCount: text(source.clientsServedCount),
    resumePdfUrl: text(source.resumePdfUrl),
    calendarBookingUrl: text(source.calendarBookingUrl),
    linkedin: text(source.linkedin),
    github: text(source.github),
    portfolioUrl: text(source.portfolioUrl),
    positioningLine: text(source.positioningLine),
    professionalSummary: text(source.professionalSummary),
    yearsOfExperience: text(source.yearsOfExperience),
    fullTimeFreelanceMention: text(source.fullTimeFreelanceMention),
    specialization: text(source.specialization),
    clientTypes: text(source.clientTypes),
    skills: skills(source.skills),
    skillCategories: asItems<PortfolioSkillCategory>(source.skillCategories, (row) => {
      const category = text(row.category);
      const names = portfolioStringList(row.skills);
      if (!category && names.length === 0) return null;
      return { category, skills: names };
    }),
    experience: asItems<PortfolioExperienceItem>(source.experience, (row) => {
      const item: PortfolioExperienceItem = {
        role: text(row.role),
        company: text(row.company),
        location: text(row.location),
        period: text(row.period),
        points: text(row.points),
        techStack: text(row.techStack),
        systemsBuilt: text(row.systemsBuilt),
        performanceImprovements: text(row.performanceImprovements),
        reusableComponents: text(row.reusableComponents),
        impact: text(row.impact),
      };
      const projects = asItems<PortfolioExperienceProject>(row.projects, (project) => {
        const entry: PortfolioExperienceProject = {
          name: text(project.name),
          summary: text(project.summary),
          contribution: text(project.contribution),
          techStack: text(project.techStack),
          impact: text(project.impact),
          url: text(project.url),
        };
        return hasContent(Object.values(entry)) ? entry : null;
      });
      if (projects.length) item.projects = projects;
      return hasContent(Object.values(item).filter((value) => !Array.isArray(value))) || projects.length
        ? item
        : null;
    }),
    projects: asItems<PortfolioProjectItem>(source.projects, (row) => {
      const item: PortfolioProjectItem = {
        name: text(row.name),
        tech: text(row.tech),
        url: text(row.url),
        highlights: text(row.highlights),
        screenshotUrl: text(row.screenshotUrl),
        resultHighlight: text(row.resultHighlight),
        isNotWorking: portfolioFlag(row.isNotWorking),
      };
      const legacyCover = text(row.imageUrl);
      if (legacyCover) item.imageUrl = legacyCover;
      return hasContent([
        item.name,
        item.tech,
        item.url,
        item.highlights,
        item.screenshotUrl,
        item.imageUrl,
        item.resultHighlight,
        item.isNotWorking,
      ])
        ? item
        : null;
    }),
    freelanceProjects: asItems<PortfolioFreelanceProjectItem>(source.freelanceProjects, (row) => {
      const item: PortfolioFreelanceProjectItem = {
        clientName: text(row.clientName),
        clientType: text(row.clientType),
        problem: text(row.problem),
        solution: text(row.solution),
        techStack: text(row.techStack),
        timeline: text(row.timeline),
        keyFeatures: text(row.keyFeatures),
        results: text(row.results),
        resultHighlight: text(row.resultHighlight),
        screenshotUrl: text(row.screenshotUrl),
        liveLink: text(row.liveLink),
        isNda: portfolioFlag(row.isNda),
        isNotWorking: portfolioFlag(row.isNotWorking),
      };
      return hasContent(Object.values(item)) ? item : null;
    }),
    featuredProjects: asItems<PortfolioFeaturedProjectItem>(source.featuredProjects, (row) => {
      const item: PortfolioFeaturedProjectItem = {
        name: text(row.name),
        problem: text(row.problem),
        solution: text(row.solution),
        architectureThinking: text(row.architectureThinking),
        keyFeatures: text(row.keyFeatures),
        resultHighlight: text(row.resultHighlight),
        screenshotUrl: text(row.screenshotUrl),
        githubLink: text(row.githubLink),
        liveLink: text(row.liveLink),
        isNotWorking: portfolioFlag(row.isNotWorking),
      };
      return hasContent(Object.values(item)) ? item : null;
    }),
    achievements: labeledList(source.achievements),
    education: asItems<PortfolioEducationItem>(source.education, (row) => {
      const item: PortfolioEducationItem = {
        degree: text(row.degree),
        institution: text(row.institution),
        location: text(row.location),
        period: text(row.period),
        grade: text(row.grade),
      };
      return hasContent(Object.values(item)) ? item : null;
    }),
    services: labeledList(source.services),
    servicesDetailed: asItems<PortfolioServiceDetail>(source.servicesDetailed, (row) => {
      const item: PortfolioServiceDetail = {
        title: text(row.title),
        description: text(row.description),
        problemItSolves: text(row.problemItSolves),
        whoItIsFor: text(row.whoItIsFor),
      };
      return hasContent(Object.values(item)) ? item : null;
    }),
    processSteps: labeledList(source.processSteps),
    faqItems: asItems<PortfolioFaqItem>(source.faqItems, (row) => {
      const item: PortfolioFaqItem = {
        question: text(row.question),
        answer: text(row.answer),
      };
      return hasContent([item.question, item.answer]) ? item : null;
    }),
    testimonials: asItems<PortfolioTestimonialItem>(source.testimonials, (row) => {
      const item: PortfolioTestimonialItem = {
        clientName: text(row.clientName),
        feedback: text(row.feedback),
        projectType: text(row.projectType),
      };
      return hasContent([item.clientName, item.feedback, item.projectType]) ? item : null;
    }),
    mediaItems: asItems<PortfolioMediaItem>(source.mediaItems, (row) => {
      const url = text(row.url);
      if (!url) return null;
      const type = fileType(row.fileType);
      return {
        title: text(row.title),
        url,
        ...(type ? { fileType: type } : {}),
        fileName: text(row.fileName),
      };
    }),
    showWIPBanner: portfolioFlag(source.showWIPBanner),
    sectionVisibility: sectionVisibility(source.sectionVisibility),
    contactCta: text(source.contactCta),
  };
}
