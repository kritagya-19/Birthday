export interface StoredShareRecord {
  slug: string;
  editToken: string;
  savedAt: string;
  payload: unknown;
}

export function sanitizeSlug(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

export function generateRandomSlug(): string {
  const words = ['sweet', 'lovely', 'forever', 'happy', 'heart', 'date', 'dreamy', 'darling'];
  const pick = words[Math.floor(Math.random() * words.length)];
  const code = Math.random().toString(36).slice(2, 7);
  return `${pick}-surprise-${code}`;
}

export function normalizeEditToken(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (trimmed.length < 8) return '';
  return trimmed.slice(0, 128);
}

export function shareBlobPathname(slug: string): string {
  return `shares/${slug}.json`;
}
