import { render, screen } from '@testing-library/react';
import PortfolioPage from '../components/site/PortfolioPage';
import { ThemeProvider } from '../context/ThemeContext';
import { buildNav } from '../components/site/model';
import { normalizePortfolio } from './normalizePortfolio';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
  class MockObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: MockObserver });
});

const messy = {
  fullName: '  Divya Shiral  ',
  email: 'Divya@example.com',
  showWIPBanner: 'false',
  avatarUrl: 'https://cdn.example.com/legacy.jpg',
  avatarUrls: [' https://cdn.example.com/a.jpg ', '', 'https://cdn.example.com/b.jpg'],
  skillCategories: [{ category: 'Frontend', skills: 'React | Next.js' }, { category: '', skills: '' }],
  skills: [{ name: 'TypeScript', percentage: 0 }, { name: '  ' }],
  experience: [{ role: '', company: '' }, { role: 'Frontend Engineer', company: 'Northwind' }],
  projects: [
    { name: '', tech: '', url: '', isNotWorking: false },
    { name: 'Portfolio', url: 'https://example.com', isNotWorking: 'false', imageUrl: 'https://cdn.example.com/old.png' },
  ],
  freelanceProjects: [
    { clientName: '', isNda: false, isNotWorking: 'no' },
    { isNda: 'yes', isNotWorking: '' },
  ],
  featuredProjects: [{ name: 'UI Kit', isNotWorking: true }, { name: '', isNotWorking: false }],
  achievements: ['Spoke at a meetup', '   '],
  services: [{ text: 'Custom React apps' }, ''],
  processSteps: [],
  education: [{ degree: '' }],
  testimonials: [{ clientName: '', feedback: '', projectType: '' }],
  faqItems: [{ question: '', answer: '' }],
  mediaItems: [
    { title: 'Notes', url: '', fileType: 'pdf' },
    { title: 'Resume', url: 'https://cdn.example.com/resume.pdf', fileType: 'PDF', fileName: 'resume.pdf' },
    { title: 'Clip', url: 'https://cdn.example.com/demo.mp4', fileType: 'docx' },
  ],
};

describe('normalizePortfolio', () => {
  const data = normalizePortfolio(messy);

  it('reads yes/no fields as real booleans and treats a blank as false', () => {
    expect(data.showWIPBanner).toBe(false);
    expect(data.projects?.[0].isNotWorking).toBe(false);
    expect(data.freelanceProjects?.[0].isNda).toBe(true);
    expect(data.freelanceProjects?.[0].isNotWorking).toBe(false);
    expect(data.featuredProjects?.[0].isNotWorking).toBe(true);
  });

  it('drops empty cards and clears a missing section', () => {
    expect(data.experience).toEqual([{ role: 'Frontend Engineer', company: 'Northwind', location: '', period: '', points: '', techStack: '', systemsBuilt: '', performanceImprovements: '', reusableComponents: '', impact: '' }]);
    expect(data.projects).toHaveLength(1);
    expect(data.projects?.[0].name).toBe('Portfolio');
    expect(data.projects?.[0].imageUrl).toBe('https://cdn.example.com/old.png');
    expect(data.featuredProjects).toHaveLength(1);
    expect(data.education).toEqual([]);
    expect(data.testimonials).toEqual([]);
    expect(data.faqItems).toEqual([]);
    expect(data.services).toEqual(['Custom React apps']);
    expect(data.achievements).toEqual(['Spoke at a meetup']);
    expect(normalizePortfolio({ fullName: 'Divya', email: 'a@b.c' }).experience).toEqual([]);
  });

  it('keeps organization projects on the role that built them', () => {
    const saved = normalizePortfolio({
      fullName: 'Divya Shiral',
      email: 'Divya@example.com',
      experience: [
        {
          role: '',
          company: '',
          projects: [
            { name: ' ', summary: '', contribution: '', techStack: '', impact: '', url: '' },
            {
              name: 'Checkout',
              summary: 'Rebuilt checkout.',
              contribution: 'Owned the React UI.',
              techStack: 'React',
              impact: '40% faster',
              url: 'https://northwind.example',
            },
          ],
        },
      ],
    });

    expect(saved.experience).toEqual([
      {
        role: '',
        company: '',
        location: '',
        period: '',
        points: '',
        techStack: '',
        systemsBuilt: '',
        performanceImprovements: '',
        reusableComponents: '',
        impact: '',
        projects: [{
          name: 'Checkout',
          summary: 'Rebuilt checkout.',
          contribution: 'Owned the React UI.',
          techStack: 'React',
          impact: '40% faster',
          url: 'https://northwind.example',
        }],
      },
    ]);

    render(
      <ThemeProvider>
        <PortfolioPage data={saved} />
      </ThemeProvider>
    );
    expect(screen.getByRole('link', { name: 'Checkout' })).toHaveAttribute('href', 'https://northwind.example');
    expect(screen.getByText('Rebuilt checkout.')).toBeInTheDocument();
    expect(screen.getByText('Owned the React UI.')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('40% faster')).toBeInTheDocument();
  });

  it('keeps photos as URLs and skill categories as a string list', () => {
    expect(data.avatarUrls).toEqual(['https://cdn.example.com/a.jpg', 'https://cdn.example.com/b.jpg']);
    expect(data.avatarUrl).toBe('https://cdn.example.com/a.jpg');
    expect(data.skillCategories).toEqual([{ category: 'Frontend', skills: ['React', 'Next.js'] }]);
    expect(data.skills).toEqual([{ name: 'TypeScript', percentage: 0 }]);
    expect(data.mediaItems).toEqual([
      { title: 'Resume', url: 'https://cdn.example.com/resume.pdf', fileType: 'pdf', fileName: 'resume.pdf' },
      { title: 'Clip', url: 'https://cdn.example.com/demo.mp4', fileName: '' },
    ]);
  });

  it('hides cleared sections and still shows an NDA card', () => {
    render(
      <ThemeProvider>
        <PortfolioPage data={data} />
      </ThemeProvider>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Divya Shiral' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Portfolio' })).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('Private client project – details available upon request.')).toBeInTheDocument();
    expect(screen.getByText('Currently not working')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'resume.pdf' })).toHaveAttribute('href', 'https://cdn.example.com/resume.pdf');
    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Frontend Engineer' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Education' })).not.toBeInTheDocument();
    expect(buildNav(data, true).map((item) => item.id)).not.toContain('education');
  });

  it('hides a section only when its visibility flag is false', () => {
    const hidden = normalizePortfolio({
      ...messy,
      education: [{ degree: 'B.E.', institution: 'University' }],
      testimonials: [{ clientName: 'Priya', feedback: 'Clear and fast.' }],
      faqItems: [{ question: 'Do you take freelance work?', answer: 'Yes.' }],
      sectionVisibility: {
        testimonials: false,
        education: false,
        media: false,
        faq: 'false',
        projects: true,
      },
    });

    expect(hidden.sectionVisibility).toEqual({
      testimonials: false,
      education: false,
      media: false,
      faq: false,
      projects: true,
    });
    expect(hidden.education).toHaveLength(1);
    expect(hidden.testimonials).toHaveLength(1);
    expect(hidden.mediaItems).toHaveLength(2);

    render(
      <ThemeProvider>
        <PortfolioPage data={hidden} />
      </ThemeProvider>
    );

    expect(screen.queryByRole('heading', { name: 'Education' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Testimonials' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Media' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'FAQ' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'resume.pdf' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Achievements' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Portfolio' })).toBeInTheDocument();
    expect(buildNav(hidden, true).map((item) => item.id)).toEqual(
      expect.arrayContaining(['projects', 'achievements'])
    );
    expect(buildNav(hidden, true).map((item) => item.id)).not.toEqual(
      expect.arrayContaining(['education', 'testimonials', 'media', 'faq'])
    );
  });
});
