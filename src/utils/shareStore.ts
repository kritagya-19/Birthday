import type { AllPagesTexts, AllPagesPhotos } from './pageContentStore';
import type { SurpriseNoteData } from '../components/SurpriseNoteContent';
import type { SharedMusicData } from '../components/WebsiteMusicModal';

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
  encodedPayload?: string;
}

interface ShareConfig {
  storage: 'fs' | 'blob' | 'client';
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
          encodedPayload: parsed.encodedPayload || '',
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
    encodedPayload: '',
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
 * Compresses a surprise payload into a compact, URL-safe Base64 string.
 * Uses native CompressionStream('deflate') where available, with Base64 fallback.
 */
export async function compressPayload(payload: SharedSurprisePayload): Promise<string> {
  const json = JSON.stringify(payload);
  if (typeof CompressionStream !== 'undefined') {
    try {
      const stream = new Blob([json]).stream().pipeThrough(new CompressionStream('deflate'));
      const buffer = await new Response(stream).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch {
      // Fall through
    }
  }

  try {
    return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
  } catch {
    return '';
  }
}

/**
 * Decompresses an encoded payload from the URL hash or parameter back into the full surprise object.
 */
export async function decompressPayload(encoded: string): Promise<SharedSurprisePayload | null> {
  if (!encoded || typeof encoded !== 'string') return null;

  // Try deflate decompression
  if (typeof DecompressionStream !== 'undefined') {
    try {
      let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const binStr = atob(b64);
      const decBytes = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) {
        decBytes[i] = binStr.charCodeAt(i);
      }
      const decStream = new Blob([decBytes]).stream().pipeThrough(new DecompressionStream('deflate'));
      const text = await new Response(decStream).text();
      const parsed = JSON.parse(text) as Partial<SharedSurprisePayload>;
      if (parsed && typeof parsed === 'object' && parsed.pageTexts) {
        return parsed as SharedSurprisePayload;
      }
    } catch {
      // Fall through to plain base64
    }
  }

  // Fallback try uncompressed URL-encoded base64
  try {
    const raw = decodeURIComponent(encoded);
    const text = decodeURIComponent(escape(atob(raw)));
    const parsed = JSON.parse(text) as Partial<SharedSurprisePayload>;
    if (parsed && typeof parsed === 'object' && parsed.pageTexts) {
      return parsed as SharedSurprisePayload;
    }
  } catch {
    // Ignore
  }

  return null;
}

/**
 * Extracts payload directly from the current browser URL (#d=... or ?d=...).
 */
export async function extractPayloadFromLocation(): Promise<SharedSurprisePayload | null> {
  if (typeof window === 'undefined') return null;

  // Check URL hash first (e.g. #d=...)
  if (window.location.hash) {
    const hash = window.location.hash.slice(1);
    const hashParams = new URLSearchParams(hash);
    const encoded =
      hashParams.get('d') ||
      hashParams.get('data') ||
      (hash.startsWith('d=') ? hash.slice(2) : hash);
    if (encoded) {
      const payload = await decompressPayload(encoded);
      if (payload) return payload;
    }
  }

  // Check URL query parameters (e.g. ?d=...)
  if (window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('d') || params.get('data');
    if (encoded) {
      const payload = await decompressPayload(encoded);
      if (payload) return payload;
    }
  }

  return null;
}

/**
 * Extracts a shared surprise slug if the current URL is `/s/:slug` or `/?s=:slug`,
 * or if a direct payload is attached in the URL hash or parameters.
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
    if (cleaned) return cleaned;
  }

  // If a payload hash or query exists, treat as a shared link
  if (
    (window.location.hash && (window.location.hash.includes('d=') || window.location.hash.length > 20)) ||
    params.has('d') ||
    params.has('data')
  ) {
    return 'surprise';
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

export function buildShareUrl(slug: string, encodedData?: string): string {
  const origin = getPublicShareOrigin();
  const cleanSlug = encodeURIComponent(slug || 'surprise');
  const data = encodedData !== undefined ? encodedData : loadLocalShareMeta().encodedPayload;
  if (data) {
    return `${origin}/s/${cleanSlug}#d=${data}`;
  }
  return `${origin}/s/${cleanSlug}`;
}

async function fetchShareConfig(): Promise<ShareConfig> {
  try {
    const res = await fetch('/api/share-config', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      return { storage: 'client' };
    }
    const data = (await res.json()) as Partial<ShareConfig>;
    return {
      storage: data.storage === 'blob' && data.blobConfigured ? 'blob' : 'client',
      blobConfigured: Boolean(data.blobConfigured),
    };
  } catch {
    return { storage: 'client' };
  }
}

async function saveSurpriseShareViaFilesystem(params: {
  slug?: string;
  payload: SharedSurprisePayload;
  editToken: string;
}): Promise<{ slug: string; savedAt: string }> {
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
  };
}

async function readApiError(res: Response): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (data.error) return data.error;
  if (res.status === 404) {
    return 'Share API is missing on this deploy. Push the latest code to GitHub and Redeploy on Vercel.';
  }
  return `Could not save surprise (HTTP ${res.status}).`;
}

/**
 * Vercel path: save JSON to Blob on the server. If the payload is too large for
 * the function body limit, fall back to a client Blob upload.
 */
async function saveSurpriseShareViaBlob(params: {
  slug?: string;
  payload: SharedSurprisePayload;
  editToken: string;
}): Promise<{ slug: string; savedAt: string }> {
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
    throw new Error(reserveData.error || 'Could not prepare surprise link.');
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
  };
}

export async function saveSurpriseShare(params: {
  slug?: string;
  payload: SharedSurprisePayload;
}): Promise<{ slug: string; savedAt: string; shareUrl: string }> {
  const meta = loadLocalShareMeta();
  const desiredSlug = params.slug !== undefined ? sanitizeCustomSlug(params.slug) : meta.savedSlug;

  // Always compress the full surprise payload to guarantee that the link
  // works everywhere, on any device, even without server database setup!
  const encodedPayload = await compressPayload(params.payload);

  const config = await fetchShareConfig();
  let resolvedSlug = desiredSlug;
  let savedAt = new Date().toISOString();

  if (config.storage === 'blob' && config.blobConfigured) {
    try {
      const blobResult = await saveSurpriseShareViaBlob({
        slug: desiredSlug || undefined,
        payload: params.payload,
        editToken: meta.editToken,
      });
      resolvedSlug = blobResult.slug;
      savedAt = blobResult.savedAt;
    } catch (err) {
      console.warn('Vercel Blob save warning, falling back to direct link encoding:', err);
      if (!resolvedSlug) {
        resolvedSlug = `sweet-surprise-${Math.random().toString(36).slice(2, 7)}`;
      }
    }
  } else if (config.storage === 'fs') {
    try {
      const fsResult = await saveSurpriseShareViaFilesystem({
        slug: desiredSlug || undefined,
        payload: params.payload,
        editToken: meta.editToken,
      });
      resolvedSlug = fsResult.slug;
      savedAt = fsResult.savedAt;
    } catch {
      if (!resolvedSlug) {
        resolvedSlug = `sweet-surprise-${Math.random().toString(36).slice(2, 7)}`;
      }
    }
  } else {
    // Client mode (e.g. fresh Vercel deploy without Blob store configured)
    if (!resolvedSlug) {
      resolvedSlug = `sweet-surprise-${Math.random().toString(36).slice(2, 7)}`;
    }
  }

  const shareUrl = buildShareUrl(resolvedSlug, encodedPayload);

  const nextMeta: LocalShareMeta = {
    editToken: meta.editToken,
    savedSlug: resolvedSlug,
    savedAt,
    encodedPayload,
  };
  saveLocalShareMeta(nextMeta);

  return {
    slug: resolvedSlug,
    savedAt,
    shareUrl,
  };
}

export async function fetchSurpriseShare(slug: string): Promise<{
  slug: string;
  savedAt: string;
  payload: SharedSurprisePayload;
}> {
  // 1. Instant hydration: Check if surprise data was passed directly in the URL hash or parameters
  const directPayload = await extractPayloadFromLocation();
  if (directPayload) {
    return {
      slug: slug || 'surprise',
      savedAt: new Date().toISOString(),
      payload: directPayload,
    };
  }

  // 2. Fetch from Vercel serverless endpoint (/api/share-get)
  try {
    const res = await fetch(`/api/share-get?slug=${encodeURIComponent(slug)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const data = (await res.json().catch(() => ({}))) as {
        slug?: string;
        savedAt?: string;
        payload?: SharedSurprisePayload;
      };

      if (data.payload && data.slug) {
        return {
          slug: data.slug,
          savedAt: data.savedAt || '',
          payload: data.payload,
        };
      }
    }
  } catch {
    // Fall through
  }

  // 3. Fallback for local Express dev server (/api/shares/:slug)
  try {
    const localRes = await fetch(`/api/shares/${encodeURIComponent(slug)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (localRes.ok) {
      const data = (await localRes.json().catch(() => ({}))) as {
        slug?: string;
        savedAt?: string;
        payload?: SharedSurprisePayload;
      };

      if (data.payload && data.slug) {
        return {
          slug: data.slug,
          savedAt: data.savedAt || '',
          payload: data.payload,
        };
      }
    }
  } catch {
    // Fall through
  }

  throw new Error('Surprise link not found. Please make sure you copied the complete link.');
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
