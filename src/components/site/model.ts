import type {
  PortfolioData,
  PortfolioSectionKey,
  PortfolioSectionVisibility,
  PortfolioServiceDetail,
} from '../../firebase/types/portfolio.types';

export interface NavItem {
  id: string;
  label: string;
  index: string;
}

/** A section is hidden only when its flag is exactly false. */
export function sectionVisible(
  visibility: PortfolioSectionVisibility | undefined,
  key: PortfolioSectionKey
): boolean {
  return visibility?.[key] !== false;
}

export function lines(value?: string): string[] {
  if (!value) return [];
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function filled(list?: string[]): string[] {
  return (list ?? []).map((item) => item.trim()).filter(Boolean);
}

export function showAbout(data: PortfolioData): boolean {
  return !!(
    data.professionalSummary?.trim() ||
    data.yearsOfExperience?.trim() ||
    data.fullTimeFreelanceMention?.trim() ||
    data.specialization?.trim() ||
    data.clientTypes?.trim()
  );
}

export function showSkills(data: PortfolioData): boolean {
  return (
    (data.skillCategories?.length ?? 0) > 0 || (data.skills?.length ?? 0) > 0
  );
}

export function detailedServices(data: PortfolioData): PortfolioServiceDetail[] {
  return (data.servicesDetailed ?? []).filter((item) => item?.title?.trim());
}

export function showServices(data: PortfolioData): boolean {
  return detailedServices(data).length > 0 || filled(data.services).length > 0;
}

export function showFaq(data: PortfolioData): boolean {
  return (data.faqItems ?? []).some((item) => item?.question?.trim() || item?.answer?.trim());
}

export function showContact(data: PortfolioData, hasForm: boolean): boolean {
  return !!(
    hasForm ||
    data.contactCta?.trim() ||
    data.email?.trim() ||
    data.phone?.trim() ||
    data.whatsapp?.trim() ||
    data.location?.trim() ||
    data.linkedin?.trim() ||
    data.github?.trim() ||
    data.portfolioUrl?.trim() ||
    data.calendarBookingUrl?.trim()
  );
}

export function workSectionHref(data: PortfolioData): string | null {
  const visibility = data.sectionVisibility;
  if (sectionVisible(visibility, 'projects') && data.projects?.length) return '#projects';
  if (sectionVisible(visibility, 'featured') && data.featuredProjects?.length) return '#featured';
  if (sectionVisible(visibility, 'freelance') && data.freelanceProjects?.length) return '#freelance';
  return null;
}

export function opensInNewTab(url: string): boolean {
  return /^https?:\/\//i.test(url.trim());
}

export function buildNav(data: PortfolioData, hasForm: boolean): NavItem[] {
  const visibility = data.sectionVisibility;
  const items: { id: string; label: string }[] = [];
  if (sectionVisible(visibility, 'about') && showAbout(data)) items.push({ id: 'about', label: 'About' });
  if (sectionVisible(visibility, 'skills') && showSkills(data)) items.push({ id: 'skills', label: 'Skills' });
  if (sectionVisible(visibility, 'experience') && data.experience?.length) items.push({ id: 'experience', label: 'Experience' });
  if (sectionVisible(visibility, 'projects') && data.projects?.length) items.push({ id: 'projects', label: 'Projects' });
  if (sectionVisible(visibility, 'featured') && data.featuredProjects?.length) items.push({ id: 'featured', label: 'Featured' });
  if (sectionVisible(visibility, 'freelance') && data.freelanceProjects?.length) items.push({ id: 'freelance', label: 'Freelance' });
  if (sectionVisible(visibility, 'services') && showServices(data)) items.push({ id: 'services', label: 'Services' });
  if (sectionVisible(visibility, 'process') && filled(data.processSteps).length) items.push({ id: 'process', label: 'Process' });
  if (sectionVisible(visibility, 'education') && data.education?.length) items.push({ id: 'education', label: 'Education' });
  if (sectionVisible(visibility, 'achievements') && filled(data.achievements).length) items.push({ id: 'achievements', label: 'Achievements' });
  if (sectionVisible(visibility, 'testimonials') && data.testimonials?.length) items.push({ id: 'testimonials', label: 'Testimonials' });
  if (sectionVisible(visibility, 'media') && (data.mediaItems ?? []).some((item) => item?.url?.trim())) {
    items.push({ id: 'media', label: 'Media' });
  }
  if (sectionVisible(visibility, 'faq') && showFaq(data)) items.push({ id: 'faq', label: 'FAQ' });
  if (sectionVisible(visibility, 'contact') && showContact(data, hasForm)) items.push({ id: 'contact', label: 'Contact' });

  return items.map((item, i) => ({
    ...item,
    index: String(i + 1).padStart(2, '0'),
  }));
}

export function digits(value?: string): string {
  return (value ?? '').replace(/\D/g, '');
}
