/** Accept a configured hostname while preserving explicit HTTP(S) URLs. */
export function normalizeAuthUrl(value: string | undefined): string | undefined {
  const configured = value?.trim();
  if (!configured) return undefined;

  const local = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(configured);
  const absolute = /^[a-z][a-z\d+.-]*:\/\//i.test(configured)
    ? configured
    : `${local ? "http" : "https"}://${configured}`;

  let url: URL;
  try {
    url = new URL(absolute);
  } catch {
    throw new Error("BETTER_AUTH_URL must be a valid HTTP(S) URL or hostname.");
  }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("BETTER_AUTH_URL must be an HTTP(S) URL without credentials.");
  }
  return url.href;
}
