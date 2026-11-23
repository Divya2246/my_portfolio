import { useMemo } from 'react';
import type { PortfolioData } from '../../firebase/types/portfolio.types';
import AboutSection from './AboutSection';
import AchievementsSection from './AchievementsSection';
import ContactSection from './ContactSection';
import EducationSection from './EducationSection';
import ExperienceSection from './ExperienceSection';
import FaqSection from './FaqSection';
import FeaturedSection from './FeaturedSection';
import FreelanceSection from './FreelanceSection';
import Hero from './Hero';
import MediaSection from './MediaSection';
import ProcessSection from './ProcessSection';
import ProjectsSection from './ProjectsSection';
import ServicesSection from './ServicesSection';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';
import SkillsSection from './SkillsSection';
import TestimonialsSection from './TestimonialsSection';
import { buildNav, sectionVisible, showAbout, showFaq, showServices, showSkills } from './model';

export default function PortfolioPage({ data }: { data: PortfolioData }) {
  const nav = useMemo(() => buildNav(data, true), [data]);
  const indexFor = (id: string) => nav.find((item) => item.id === id)?.index ?? '';
  const show = (key: Parameters<typeof sectionVisible>[1]) => sectionVisible(data.sectionVisibility, key);

  return (
    <>
      <SiteHeader name={data.fullName} items={nav} />
      <main id="top" tabIndex={-1} className="outline-none">
        {show('hero') ? <Hero data={data} /> : null}
        {show('about') && showAbout(data) ? <AboutSection data={data} index={indexFor('about')} /> : null}
        {show('skills') && showSkills(data) ? <SkillsSection data={data} index={indexFor('skills')} /> : null}
        {show('experience') && data.experience?.length ? (
          <ExperienceSection experience={data.experience} index={indexFor('experience')} />
        ) : null}
        {show('projects') && data.projects?.length ? <ProjectsSection projects={data.projects} index={indexFor('projects')} /> : null}
        {show('featured') && data.featuredProjects?.length ? (
          <FeaturedSection projects={data.featuredProjects} index={indexFor('featured')} />
        ) : null}
        {show('freelance') && data.freelanceProjects?.length ? (
          <FreelanceSection projects={data.freelanceProjects} index={indexFor('freelance')} />
        ) : null}
        {show('services') && showServices(data) ? <ServicesSection data={data} index={indexFor('services')} /> : null}
        {show('process') && data.processSteps?.length ? <ProcessSection steps={data.processSteps} index={indexFor('process')} /> : null}
        {show('education') && data.education?.length ? <EducationSection education={data.education} index={indexFor('education')} /> : null}
        {show('achievements') && data.achievements?.length ? (
          <AchievementsSection achievements={data.achievements} index={indexFor('achievements')} />
        ) : null}
        {show('testimonials') && data.testimonials?.length ? (
          <TestimonialsSection testimonials={data.testimonials} index={indexFor('testimonials')} />
        ) : null}
        {show('media') && data.mediaItems?.length ? <MediaSection items={data.mediaItems} index={indexFor('media')} /> : null}
        {show('faq') && showFaq(data) && data.faqItems ? <FaqSection items={data.faqItems} index={indexFor('faq')} /> : null}
        {show('contact') && nav.some((item) => item.id === 'contact') ? (
          <ContactSection data={data} index={indexFor('contact')} />
        ) : null}
      </main>
      <SiteFooter name={data.fullName} location={data.location} />
    </>
  );
}
