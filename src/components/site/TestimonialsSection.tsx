import type { PortfolioTestimonialItem } from '../../firebase/types/portfolio.types';
import { Band, Reveal, SectionIndex } from './ui';

export default function TestimonialsSection({
  testimonials,
  index,
}: {
  testimonials: PortfolioTestimonialItem[];
  index: string;
}) {
  return (
    <Band id="testimonials">
      <SectionIndex index={index} title="Testimonials" />
      <div className="grid gap-3 md:grid-cols-2">
        {testimonials.map((item, i) => (
          <Reveal key={i} delay={Math.min(i, 4) * 40}>
            <figure className="panel h-full p-4">
              {item.feedback ? (
                <blockquote className="text-base leading-relaxed text-ink">{item.feedback}</blockquote>
              ) : null}
              <figcaption className="mt-3 text-sm text-faint">
                {item.clientName || 'Client'}
                {item.projectType ? ` — ${item.projectType}` : ''}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Band>
  );
}
