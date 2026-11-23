export const SITE_NAME = 'shiraldivya25@gmail.com';
export const CONTACT_FROM_NAME = 'shiraldivya25@gmail.com';

/** Mailto fallback when Web3Forms is missing or the request fails. */
export const CONTACT_EMAIL =
  (process.env.REACT_APP_CONTACT_EMAIL ?? '').trim() || 'allcontactsupport@gmail.com';

/** Label used in the Web3Forms subject and project_name fields. */
export function contactProjectLabel(): string {
  if (typeof window === 'undefined') return SITE_NAME;
  const host = window.location.hostname.trim();
  if (!host || host === 'localhost' || host === '127.0.0.1') return SITE_NAME;
  return host;
}
