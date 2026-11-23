/**
 * Portfolio data shape stored in Firestore `portfolios/{userId}`.
 * Matches the Display Checklist & Integration Spec (§4).
 */

/** Skill (flat list) – Option B when skillCategories not used */
export interface PortfolioSkillItem {
  name: string;
  percentage?: number;
}

/** Skill category – Option A when present */
export interface PortfolioSkillCategory {
  category: string;
  skills: string[];
}

/** Other projects (projects[]) */
export interface PortfolioProjectItem {
  name: string;
  tech?: string;
  url?: string;
  highlights?: string;
  imageUrl?: string;
  screenshotUrl?: string;
  resultHighlight?: string;
  /** Live demo is down. Saved as a real boolean; blank means false. */
  isNotWorking?: boolean;
}

export interface PortfolioEducationItem {
  degree: string;
  institution?: string;
  location?: string;
  period?: string;
  grade?: string;
}

/** A product delivered while working in an organization role. */
export interface PortfolioExperienceProject {
  name: string;
  /** What the project was. */
  summary?: string;
  /** What you did on it. */
  contribution?: string;
  techStack?: string;
  impact?: string;
  url?: string;
}

export interface PortfolioExperienceItem {
  role: string;
  company?: string;
  location?: string;
  period?: string;
  points?: string;
  techStack?: string;
  systemsBuilt?: string;
  performanceImprovements?: string;
  reusableComponents?: string;
  impact?: string;
  /** Products built in this role. */
  projects?: PortfolioExperienceProject[];
}

/** Freelance project – when isNda true, show only the NDA message and an optional not-working badge */
export interface PortfolioFreelanceProjectItem {
  clientName?: string;
  clientType?: string;
  problem?: string;
  solution?: string;
  techStack?: string;
  timeline?: string;
  keyFeatures?: string;
  results?: string;
  liveLink?: string;
  screenshotUrl?: string;
  resultHighlight?: string;
  /** Live demo is down. Saved as a real boolean; blank means false. */
  isNotWorking?: boolean;
  /** When true, the public site shows only the NDA message. Blank means false. */
  isNda?: boolean;
}

/** Featured project (personal / side) */
export interface PortfolioFeaturedProjectItem {
  name?: string;
  problem?: string;
  solution?: string;
  architectureThinking?: string;
  keyFeatures?: string;
  githubLink?: string;
  liveLink?: string;
  screenshotUrl?: string;
  resultHighlight?: string;
  /** Live demo is down. Saved as a real boolean; blank means false. */
  isNotWorking?: boolean;
}

export interface PortfolioServiceDetail {
  title?: string;
  description?: string;
  problemItSolves?: string;
  whoItIsFor?: string;
}

export interface PortfolioFaqItem {
  question?: string;
  answer?: string;
}

export interface PortfolioTestimonialItem {
  clientName?: string;
  feedback?: string;
  projectType?: string;
}

export const PORTFOLIO_SECTION_KEYS = [
  'hero',
  'about',
  'skills',
  'experience',
  'freelance',
  'featured',
  'projects',
  'services',
  'process',
  'achievements',
  'testimonials',
  'education',
  'resume',
  'faq',
  'contact',
  'media',
] as const;

export type PortfolioSectionKey = (typeof PORTFOLIO_SECTION_KEYS)[number];

/** Only `false` hides a section. A missing name means the section is shown. */
export type PortfolioSectionVisibility = Partial<Record<PortfolioSectionKey, boolean>>;

export type PortfolioMediaFileType = 'image' | 'pdf' | 'video';

export interface PortfolioMediaItem {
  title: string;
  url: string;
  fileType?: PortfolioMediaFileType;
  fileName?: string;
}

/** Root portfolio document (portfolios/{userId}) */
export interface PortfolioData {
  fullName: string;
  title?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  avatarUrl?: string;
  /** Profile pictures in display order. The first entry matches `avatarUrl`. */
  avatarUrls?: string[];
  heroCtaText?: string;
  heroCtaLink?: string;
  projectsCompletedCount?: string;
  clientsServedCount?: string;
  resumePdfUrl?: string;
  calendarBookingUrl?: string;
  linkedin?: string;
  github?: string;
  portfolioUrl?: string;
  positioningLine?: string;
  professionalSummary?: string;
  yearsOfExperience?: string;
  fullTimeFreelanceMention?: string;
  specialization?: string;
  clientTypes?: string;
  skills?: PortfolioSkillItem[];
  skillCategories?: PortfolioSkillCategory[];
  experience?: PortfolioExperienceItem[];
  projects?: PortfolioProjectItem[];
  freelanceProjects?: PortfolioFreelanceProjectItem[];
  featuredProjects?: PortfolioFeaturedProjectItem[];
  achievements?: string[];
  education?: PortfolioEducationItem[];
  services?: string[];
  servicesDetailed?: PortfolioServiceDetail[];
  processSteps?: string[];
  faqItems?: PortfolioFaqItem[];
  testimonials?: PortfolioTestimonialItem[];
  mediaItems?: PortfolioMediaItem[];
  /** Saved as a real boolean. Blank or missing means the public site is shown. */
  showWIPBanner?: boolean;
  /** Per-section show/hide. `false` hides that section. Missing names stay visible. */
  sectionVisibility?: PortfolioSectionVisibility;
  contactCta?: string;
}
