import { Construction, Mail, Phone, User } from 'lucide-react';
import { ThemeToggle } from './site/ui';

interface UnderConstructionBannerProps {
  fullName?: string;
  phone?: string;
  email?: string;
}

export default function UnderConstructionBanner({
  fullName = 'Ankit Patil',
  phone = '9922328647',
  email = 'mailofdeveloper@gmail.com',
}: UnderConstructionBannerProps) {
  const telHref = phone ? `tel:${phone.replace(/\D/g, '')}` : undefined;
  const displayPhone = phone?.replace(/^\+91-?/, '') ?? phone;

  return (
    <section id="contact" className="relative flex min-h-screen items-center px-5 py-24">
      <div className="fixed z-40" style={{ top: 'calc(1rem + env(safe-area-inset-top))', right: '1rem' }}>
        <ThemeToggle />
      </div>
      <div className="panel relative mx-auto w-full max-w-xl overflow-hidden">
        <div className="h-px bg-accent" style={{ width: '70%' }} />
        <div className="p-6 sm:p-10">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-elevated text-accent">
            <Construction size={24} strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Building a better experience for you
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            My portfolio is currently being redesigned. Stay tuned for something amazing.
          </p>
          <div className="mt-8 space-y-4 border-t border-line pt-6">
            <div className="flex items-center gap-3 text-ink">
              <User size={18} className="shrink-0 text-accent" />
              <span className="font-medium">{fullName}</span>
            </div>
            {telHref ? (
              <div className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-accent" />
                <a href={telHref} className="text-link">
                  {displayPhone}
                </a>
              </div>
            ) : null}
            {email ? (
              <div className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-accent" />
                <a href={`mailto:${email}`} className="text-link break-all">
                  {email}
                </a>
              </div>
            ) : null}
          </div>
          <p className="mt-8 text-sm text-faint">
            Developed by <span className="font-medium text-accent"><a href="https://ankitpatil.com" target="_blank" rel="noopener noreferrer">ankitpatil.com</a></span>
          </p>
        </div>
      </div>
    </section>
  );
}
