export default function SiteFooter({ name, location }: { name: string; location?: string }) {
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-faint">{name}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {location ? <p className="text-faint">{location}</p> : null}
          <a href="#top" className="text-muted hover:text-ink">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
