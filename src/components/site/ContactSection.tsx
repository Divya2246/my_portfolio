import { useState, type FormEvent } from 'react';
import { CONTACT_EMAIL } from '../../config/site';
import type { PortfolioData } from '../../firebase/types/portfolio.types';
import { CONTACT_FIELD_LIMITS } from '../../utils/constants';
import { submitContactViaWeb3Forms } from '../../utils/web3forms';
import { digits } from './model';
import { Band, SectionIndex } from './ui';

function contactQuery(): { source: string; template: string } {
  if (typeof window === 'undefined') return { source: 'contact-page', template: '' };
  const params = new URLSearchParams(window.location.search);
  return {
    source: (params.get('source') ?? '').trim() || 'contact-page',
    template: (params.get('template') ?? '').trim(),
  };
}

function initialMessage(): string {
  const template = contactQuery().template;
  if (!template) return '';
  return `Please add this template: ${template.slice(0, CONTACT_FIELD_LIMITS.template)}`;
}

function ContactRow({ href, label, value, external }: { href: string; label: string; value: string; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex min-h-12 items-center justify-between gap-4 border-b border-line py-3 text-left"
    >
      <span className="shrink-0 text-sm text-faint">{label}</span>
      <span className="min-w-0 break-all text-right text-sm text-ink md:text-base">{value}</span>
    </a>
  );
}

export default function ContactSection({ data, index }: { data: PortfolioData; index: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(initialMessage);
  const [botcheck, setBotcheck] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const whatsappNumber = digits(data.whatsapp) || digits(data.phone);
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;
  const fallbackEmail = data.email?.trim() || CONTACT_EMAIL;
  const mailto = `mailto:${fallbackEmail}`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;
    const formData = new FormData(event.currentTarget);
    setStatus('sending');
    setError('');
    const query = contactQuery();
    const result = await submitContactViaWeb3Forms({
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
      botcheck: String(formData.get('botcheck') ?? ''),
      source: query.source,
      template: query.template,
    });
    if (result.ok) {
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setBotcheck('');
      return;
    }
    setStatus('error');
    setError(result.error);
  };

  return (
    <Band id="contact">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <SectionIndex index={index} title="Contact" text={data.contactCta?.trim()} />
          {data.calendarBookingUrl?.trim() ? (
            <a
              href={data.calendarBookingUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mb-5"
            >
              Book a call
            </a>
          ) : null}
          <div className="border-t border-line">
            {data.email ? <ContactRow href={`mailto:${data.email}`} label="Email" value={data.email} /> : null}
            {data.phone ? <ContactRow href={`tel:${digits(data.phone)}`} label="Phone" value={data.phone} /> : null}
            {whatsappUrl ? (
              <ContactRow href={whatsappUrl} label="WhatsApp" value={data.whatsapp || data.phone || 'WhatsApp'} external />
            ) : null}
            {data.linkedin ? <ContactRow href={data.linkedin} label="LinkedIn" value="Profile" external /> : null}
            {data.github ? <ContactRow href={data.github} label="GitHub" value="Profile" external /> : null}
            {data.portfolioUrl ? <ContactRow href={data.portfolioUrl} label="Website" value={data.portfolioUrl} external /> : null}
            {data.location ? (
              <p className="flex min-h-12 items-center justify-between gap-4 border-b border-line py-3">
                <span className="text-sm text-faint">Location</span>
                <span className="text-right text-sm text-ink md:text-base">{data.location}</span>
              </p>
            ) : null}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="panel relative h-fit p-4 sm:p-5 lg:col-span-7">
          <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
            <label htmlFor="botcheck">Leave this field empty</label>
            <input
              id="botcheck"
              type="text"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              value={botcheck}
              onChange={(event) => setBotcheck(event.target.value)}
            />
          </div>
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Name</span>
              <input
                className="field"
                name="name"
                autoComplete="name"
                value={name}
                maxLength={CONTACT_FIELD_LIMITS.name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Email</span>
              <input
                className="field"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                maxLength={CONTACT_FIELD_LIMITS.email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Message</span>
              <textarea
                className="field"
                name="message"
                value={message}
                maxLength={CONTACT_FIELD_LIMITS.message}
                onChange={(event) => setMessage(event.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit" className="btn btn-primary mt-6 w-full sm:w-auto" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status === 'success' ? (
            <p role="status" className="mt-4 text-sm text-ok">
              Message sent. I&apos;ll get back to you soon.
            </p>
          ) : null}
          {status === 'error' ? (
            <p role="status" className="mt-4 text-sm text-danger">
              {error}{' '}
              <a href={mailto} className="text-link">
                {fallbackEmail}
              </a>
            </p>
          ) : null}
        </form>
      </div>
    </Band>
  );
}
