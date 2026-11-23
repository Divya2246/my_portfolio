import { FileText } from 'lucide-react';
import type { PortfolioMediaFileType, PortfolioMediaItem } from '../../firebase/types/portfolio.types';
import { Band, SectionIndex } from './ui';

function inferFileType(url: string): PortfolioMediaFileType {
  const lower = url.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if ([/\.webm$/, /\.mp4$/, /\.ogg$/, /\.mov$/].some((pattern) => pattern.test(lower))) return 'video';
  return 'image';
}

export default function MediaSection({ items, index }: { items: PortfolioMediaItem[]; index: string }) {
  const media = items.filter((item) => item?.url?.trim());
  if (!media.length) return null;

  return (
    <Band id="media">
      <SectionIndex index={index} title="Media" />
      <div className="grid gap-3 sm:grid-cols-2">
        {media.map((item, i) => {
          const type =
            item.fileType === 'image' || item.fileType === 'pdf' || item.fileType === 'video'
              ? item.fileType
              : inferFileType(item.url);
          return (
            <figure key={`${item.url}-${i}`} className={`panel overflow-hidden ${type === 'video' ? 'sm:col-span-2' : ''}`}>
              {item.title ? <figcaption className="px-4 pt-3 text-sm font-medium">{item.title}</figcaption> : null}
              {type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.title || 'Media'}
                  loading="lazy"
                  decoding="async"
                  className="mt-3 max-h-64 w-full object-cover object-top"
                />
              ) : null}
              {type === 'pdf' ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-2 px-4 py-3 text-sm">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  {item.fileName || 'Open PDF'}
                </a>
              ) : null}
              {type === 'video' ? (
                <video src={item.url} controls className="mt-3 max-h-80 w-full" title={item.title} />
              ) : null}
            </figure>
          );
        })}
      </div>
    </Band>
  );
}
