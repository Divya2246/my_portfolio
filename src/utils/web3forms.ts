import { CONTACT_FROM_NAME, contactProjectLabel } from '../config/site';
import { CONTACT_FIELD_LIMITS, CONTACT_SUBMIT_TIMEOUT_MS, WEB3FORMS_ENDPOINT } from './constants';

export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
  botcheck?: string;
  source?: string;
  template?: string;
}

export type ContactSubmitResult = { ok: true } | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cap(value: string | undefined, max: number): string {
  return (value ?? '').trim().slice(0, max);
}

function readAccessKey(accessKey?: string): string {
  return (accessKey ?? process.env.REACT_APP_WEB3FORMS_ACCESS_KEY ?? '').trim();
}

/**
 * POST the contact form to Web3Forms. A filled honeypot returns success and does not call the API.
 */
export async function submitContactViaWeb3Forms(
  input: ContactFormInput,
  accessKey?: string
): Promise<ContactSubmitResult> {
  if ((input.botcheck ?? '').trim()) {
    return { ok: true };
  }

  const key = readAccessKey(accessKey);
  if (!key) {
    return { ok: false, error: 'Contact form is not configured.' };
  }

  const name = cap(input.name, CONTACT_FIELD_LIMITS.name);
  const email = cap(input.email, CONTACT_FIELD_LIMITS.email);
  const message = cap(input.message, CONTACT_FIELD_LIMITS.message);
  const source = cap(input.source, CONTACT_FIELD_LIMITS.source);
  const template = cap(input.template, CONTACT_FIELD_LIMITS.template);

  if (!name || !email || !message || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'Could not send your message. Please try again.' };
  }

  const projectName = contactProjectLabel();
  const subjectName = name.slice(0, CONTACT_FIELD_LIMITS.subjectName);
  const body = new FormData();
  body.set('access_key', key);
  body.set('name', name);
  body.set('email', email);
  body.set('replyto', email);
  body.set('message', message);
  body.set('botcheck', '');
  body.set('project_name', projectName);
  body.set('subject', `[${projectName}] Contact from ${subjectName}`);
  body.set('from_name', CONTACT_FROM_NAME);
  if (source) body.set('source', source);
  if (template) body.set('template', template);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONTACT_SUBMIT_TIMEOUT_MS);

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      body,
      signal: controller.signal,
    });

    let data: { success?: boolean; message?: string } = {};
    try {
      data = (await response.json()) as { success?: boolean; message?: string };
    } catch {
      data = {};
    }

    if (response.ok && data.success === true) {
      return { ok: true };
    }

    return {
      ok: false,
      error: data.message?.trim() || 'Could not send your message. Please try again.',
    };
  } catch {
    return { ok: false, error: 'Network error. Please try again or email us directly.' };
  } finally {
    clearTimeout(timer);
  }
}
