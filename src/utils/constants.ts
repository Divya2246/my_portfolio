export const CONTACT_FIELD_LIMITS = {
  name: 120,
  email: 254,
  message: 8000,
  source: 80,
  template: 200,
  subjectName: 80,
} as const;

export const CONTACT_SUBMIT_TIMEOUT_MS = 20_000;

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
