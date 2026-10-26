import { AllPagesTexts, AllPagesPhotos } from './pageContentStore';
import { SurpriseNoteData } from '../components/SurpriseNoteContent';
import { SharedMusicData } from '../components/WebsiteMusicModal';

export interface SharedSurprisePayload {
  version: 1;
  themeId: string;
  pageTexts: AllPagesTexts;
  pagePhotos: AllPagesPhotos;
  surpriseNote: SurpriseNoteData;
  music: SharedMusicData;
}

interface LocalShareMeta {
  editToken: string;
  savedSlug: string;
  savedAt: string;
}

interface ShareConfig {
  storage: 'fs' | 'blob';
  blobConfigured?: boolean;
}

const SHARE_META_STORAGE_KEY = 'scrapbook_mail_share_meta_v1';

function generateEditToken(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `tok_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

export function loadLocalShareMeta(): LocalShareMeta {
  try {
    const raw = localStorage.getItem(SHARE_META_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LocalShareMeta>;
      if (parsed.editToken) {
        return {
          editToken: parsed.editToken,
          savedSlug: parsed.savedSlug || '',
          savedAt: parsed.savedAt || '',
        };
      }
    }
  } catch {
    // Ignore storage read errors
  }

  const fresh: LocalShareMeta = {
    editToken: generateEditToken(),
    savedSlug: '',
    savedAt: '',
  };
  saveLocalShareMeta(fresh);
  return fresh;
}

export function saveLocalShareMeta(meta: LocalShareMeta): void {
  try {
    localStorage.setItem(SHARE_META_STORAGE_KEY, JSON.stringify(meta));
  } catch {
    // Ignore storage write errors
  }
}

export function sanitizeCustomSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

/**
 * Extracts a shared surprise slug if the current URL is `/s/:slug` or `/?s=:slug`.
 */
export function getShareSlugFromLocation(): string | null {
  if (typeof window === 'undefined') return null;

  const pathMatch = window.location.pathname.match(/^\/s\/([a-zA-Z0-9_-]+)\/?$/);
  if (pathMatch?.[1]) {
    return sanitizeCustomSlug(pathMatch[1]);
  }

  const params = new URLSearchParams(window.location.search);
  const querySlug = params.get('s');
  if (querySlug) {
    const cleaned = sanitizeCustomSlug(querySlug);
    return cleaned || null;
  }

  return null;
}

/**
 * Computes the public origin so links copied from AI Studio's dev preview (`ais-dev-...`)
 * automatically use the public shared app URL (`ais-pre-...`) accessible to the partner on any device.
 */
export function getPublicShareOrigin(): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  if (origin.startsWith('https://ais-dev-')) {
    return origin.replace('https://ais-dev-', 'https://ais-pre-');
  }
  return origin;
}

export function buildShareUrl(slug: string): string {
  const origin = getPublicShareOrigin();
  return `${origin}/s/${encodeURIComponent(slug)}`;
}

async function fetchShareConfig(): Promise<ShareConfig> {
  try {
    const res = await fetch('/api/share-config', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      return { storage: 'fs' };
    }
    const data = (await res.json()) as Partial<ShareConfig>;
    return {
      storage: data.storage === 'blob' ? 'blob' : 'fs',
      blobConfigured: Boolean(data.blobConfigured),
    };
  } catch {
    return { storage: 'fs' };
  }
}

async function saveSurpriseShareViaFilesystem(params: {
  slug?: string;
  payload: SharedSurprisePayload;
  editToken: string;
}): Promise<{ slug: string; savedAt: string; shareUrl: string }> {
  const desiredSlug = params.slug !== undefined ? sanitizeCustomSlug(params.slug) : '';

  const res = await fetch('/api/shares', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: desiredSlug || undefined,
      editToken: params.editToken,
      payload: params.payload,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    slug?: string;
    savedAt?: string;
    error?: string;
  };

  if (!res.ok || !data.slug) {
    throw new Error(data.error || 'Could not save surprise right now. Please try again.');
  }

  return {
    slug: data.slug,
    savedAt: data.savedAt || new Date().toISOString(),
    shareUrl: buildShareUrl(data.slug),
  };
}

async function readApiError(res: Response): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (data.error) return data.error;
  if (res.status === 404) {
    return 'Share API is missing on this deploy. Push the latest code to GitHub and Redeploy on Vercel.';
  }
  return `Could not save surprise (HTTP ${res.status}). Push the latest code and Redeploy.`;
}

/**
 * Vercel path: save JSON to Blob on the server. If the payload is too large for
 * the function body limit, fall back to a client Blob upload.
 */
async function saveSurpriseShareViaBlob(params: {
  slug?: string;
  payload: SharedSurprisePayload;
  editToken: string;
}): Promise<{ slug: string; savedAt: string; shareUrl: string }> {
  const desiredSlug = params.slug !== undefined ? sanitizeCustomSlug(params.slug) : '';

  const saveRes = await fetch('/api/share-save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: desiredSlug || undefined,
      editToken: params.editToken,
      payload: params.payload,
    }),
  });

  if (saveRes.ok) {
    const data = (await saveRes.json().catch(() => ({}))) as {
      slug?: string;
      savedAt?: string;
    };
    if (data.slug) {
      return {
        slug: data.slug,
        savedAt: data.savedAt || new Date().toISOString(),
        shareUrl: buildShareUrl(data.slug),
      };
    }
  }

  const tooLarge = saveRes.status === 413;
  if (!tooLarge && !saveRes.ok) {
    throw new Error(await readApiError(saveRes));
  }

  const reserveRes = await fetch('/api/share-save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: desiredSlug || undefined,
      editToken: params.editToken,
      allocateOnly: true,
    }),
  });

  const reserveData = (await reserveRes.json().catch(() => ({}))) as {
    slug?: string;
    error?: string;
  };

  if (!reserveRes.ok || !reserveData.slug) {
    throw new Error(
      reserveData.error ||
        'Could not prepare surprise link. Push the latest code to GitHub, then Redeploy on Vercel.'
    );
  }

  const slug = reserveData.slug;
  const savedAt = new Date().toISOString();
  const record = {
    slug,
    editToken: params.editToken,
    savedAt,
    payload: params.payload,
  };

  const { upload } = await import('@vercel/blob/client');
  await upload(`shares/${slug}.json`, JSON.stringify(record), {
    access: 'public',
    handleUploadUrl: '/api/share-upload',
    contentType: 'application/json',
    clientPayload: JSON.stringify({ editToken: params.editToken, slug }),
  });

  return {
    slug,
    savedAt,
    shareUrl: buildShareUrl(slug),
  };
}

export async function saveSurpriseShare(params: {
  slug?: string;
  payload: SharedSurprisePayload;
}): Promise<{ slug: string; savedAt: string; shareUrl: string }> {
  const meta = loadLocalShareMeta();
  const desiredSlug = params.slug !== undefined ? sanitizeCustomSlug(params.slug) : meta.savedSlug;

  const config = await fetchShareConfig();
  const saved =
    config.storage === 'blob'
      ? await saveSurpriseShareViaBlob({
          slug: desiredSlug || undefined,
          payload: params.payload,
          editToken: meta.editToken,
        })
      : await saveSurpriseShareViaFilesystem({
          slug: desiredSlug || undefined,
          payload: params.payload,
          editToken: meta.editToken,
        });

  const nextMeta: LocalShareMeta = {
    editToken: meta.editToken,
    savedSlug: saved.slug,
    savedAt: saved.savedAt,
  };
  saveLocalShareMeta(nextMeta);

  return saved;
}

export async function fetchSurpriseShare(slug: string): Promise<{
  slug: string;
  savedAt: string;
  payload: SharedSurprisePayload;
}> {
  const res = await fetch(`/api/share-get?slug=${encodeURIComponent(slug)}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  const data = (await res.json().catch(() => ({}))) as {
    slug?: string;
    savedAt?: string;
    payload?: SharedSurprisePayload;
    error?: string;
  };

  if (!res.ok || !data.payload || !data.slug) {
    throw new Error(data.error || 'Surprise link not found.');
  }

  return {
    slug: data.slug,
    savedAt: data.savedAt || '',
    payload: data.payload,
  };
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to textarea copy fallback inside iframes
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
