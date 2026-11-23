import type { PortfolioFaqItem } from '../../firebase/types/portfolio.types';
import { Band, SectionIndex } from './ui';

export default function FaqSection({ items, index }: { items: PortfolioFaqItem[]; index: string }) {
  const visible = items.filter((item) => item?.question?.trim() || item?.answer?.trim());
  if (!visible.length) return null;

  return (
    <Band id="faq">
      <SectionIndex index={index} title="FAQ" />
      <div className="space-y-3">
        {visible.map((item, i) => {
          const question = item.question?.trim();
          const answer = item.answer?.trim();
          if (!question) {
            return (
              <p key={i} className="panel whitespace-pre-line p-4 text-sm leading-relaxed text-muted md:text-base">
                {answer}
              </p>
            );
          }
          return (
            <details key={i} className="panel group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-base font-medium text-ink [&::-webkit-details-marker]:hidden">
                <span>{question}</span>
                <span className="text-signal transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              {answer ? (
                <p className="whitespace-pre-line px-4 pb-4 text-sm leading-relaxed text-muted md:text-base">{answer}</p>
              ) : null}
            </details>
          );
        })}
      </div>
    </Band>
  );
}
