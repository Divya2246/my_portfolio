import { CONTACT_SUBMIT_TIMEOUT_MS, WEB3FORMS_ENDPOINT } from './constants';
import { submitContactViaWeb3Forms } from './web3forms';

const fields = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Hello from the portfolio form.',
  source: 'contact-page',
};

function mockFetch(response: { ok: boolean; status?: number; json?: unknown }) {
  return jest.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? (response.ok ? 200 : 400),
    json: async () => response.json,
  });
}

describe('submitContactViaWeb3Forms', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
  });

  it('posts FormData to Web3Forms with the reply address and an empty honeypot', async () => {
    const fetchMock = mockFetch({ ok: true, json: { success: true } });
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await submitContactViaWeb3Forms(fields, 'test-access-key');

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(WEB3FORMS_ENDPOINT);
    expect(init.method).toBe('POST');
    const body = init.body as FormData;
    expect(body.get('access_key')).toBe('test-access-key');
    expect(body.get('name')).toBe(fields.name);
    expect(body.get('email')).toBe(fields.email);
    expect(body.get('replyto')).toBe(fields.email);
    expect(body.get('message')).toBe(fields.message);
    expect(body.get('botcheck')).toBe('');
    expect(body.get('from_name')).toBe('shiraldivya25@gmail.com');
    expect(body.get('project_name')).toBe('shiraldivya25@gmail.com');
    expect(body.get('subject')).toBe('[shiraldivya25@gmail.com] Contact from Ada Lovelace');
    expect(body.get('source')).toBe('contact-page');
  });

  it('does not call the API when the honeypot is filled', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await submitContactViaWeb3Forms(
      { ...fields, botcheck: 'I am a bot' },
      'test-access-key'
    );

    expect(result).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns the configuration error when the access key is missing', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await submitContactViaWeb3Forms(fields, '');

    expect(result).toEqual({ ok: false, error: 'Contact form is not configured.' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns the API message when Web3Forms rejects the submission', async () => {
    global.fetch = mockFetch({
      ok: false,
      json: { success: false, message: 'This is a test submission.' },
    }) as unknown as typeof fetch;

    const result = await submitContactViaWeb3Forms(fields, 'test-access-key');

    expect(result).toEqual({ ok: false, error: 'This is a test submission.' });
  });

  it('returns a network error when fetch throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    const result = await submitContactViaWeb3Forms(fields, 'test-access-key');

    expect(result).toEqual({
      ok: false,
      error: 'Network error. Please try again or email us directly.',
    });
  });

  it('returns a network error when the request times out', async () => {
    jest.useFakeTimers();
    global.fetch = jest.fn((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });
    }) as unknown as typeof fetch;

    const pending = submitContactViaWeb3Forms(fields, 'test-access-key');
    jest.advanceTimersByTime(CONTACT_SUBMIT_TIMEOUT_MS);

    await expect(pending).resolves.toEqual({
      ok: false,
      error: 'Network error. Please try again or email us directly.',
    });
  });
});
