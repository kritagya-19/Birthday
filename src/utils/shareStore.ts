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
  storageMode?: 'fs' | 'blob' | 'client';
  backendSaved?: boolean;
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
          storageMode: parsed.storageMode,
          backendSaved: parsed.backendSaved,
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
    storageMode: 'client',
    backendSaved: false,
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
 * Extracts a shared surprise slug if the current URL is `/s/:slug`, `#/s/:slug`, or `/?s=:slug`,
 * or if a direct payload is attached in the URL hash or parameters.
 */
export function getShareSlugFromLocation(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Standard path: /s/:slug
  const pathMatch = window.location.pathname.match(/^\/s\/([a-zA-Z0-9_-]+)\/?$/);
  if (pathMatch?.[1]) {
    return sanitizeCustomSlug(pathMatch[1]);
  }

  // 2. Hash routing: #/s/:slug or #s=:slug
  if (window.location.hash) {
    const hashRouteMatch = window.location.hash.match(/^#\/s\/([a-zA-Z0-9_-]+)\/?/);
    if (hashRouteMatch?.[1]) {
      return sanitizeCustomSlug(hashRouteMatch[1]);
    }
    const hashParamMatch = window.location.hash.match(/[#&]s=([a-zA-Z0-9_-]+)/);
    if (hashParamMatch?.[1]) {
      return sanitizeCustomSlug(hashParamMatch[1]);
    }
  }

  // 3. Query string: ?s=:slug
  const params = new URLSearchParams(window.location.search);
  const querySlug = params.get('s');
  if (querySlug) {
    const cleaned = sanitizeCustomSlug(querySlug);
    if (cleaned) return cleaned;
  }

  // 4. If a direct compressed payload hash or query exists, treat as a shared link
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
 * Also normalizes Windows 0.0.0.0 addresses to localhost so shared links work reliably.
 */
export function getPublicShareOrigin(): string {
  if (typeof window === 'undefined') return '';
  let origin = window.location.origin;
  if (origin.startsWith('https://ais-dev-')) {
    origin = origin.replace('https://ais-dev-', 'https://ais-pre-');
  }
  if (origin.includes('0.0.0.0')) {
    origin = origin.replace('0.0.0.0', 'localhost');
  }
  return origin;
}

export function buildShareUrl(slug: string, encodedData?: string): string {
  const origin = getPublicShareOrigin();
  const cleanSlug = encodeURIComponent(slug || 'surprise');
  const meta = loadLocalShareMeta();
  const data = encodedData !== undefined ? encodedData : meta.encodedPayload;

  // When saved on the server (fs or blob), provide a clean, short URL so messaging apps
  // never truncate the link. Only append #d=... when purely in client-only fallback mode.
  if (meta.storageMode === 'client' && data) {
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
    const storage: 'fs' | 'blob' | 'client' =
      data.storage === 'fs'
        ? 'fs'
        : data.storage === 'blob' && data.blobConfigured
        ? 'blob'
        : 'client';
    return {
      storage,
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
  try {
    const meta = loadLocalShareMeta();
    let resolvedSlug = params.slug !== undefined ? sanitizeCustomSlug(params.slug) : meta.savedSlug;
    if (!resolvedSlug) {
      resolvedSlug = `sweet-surprise-${Math.random().toString(36).slice(2, 7)}`;
    }

    // Always compress backup payload for client offline support
    const encodedPayload = await compressPayload(params.payload);
    let savedAt = new Date().toISOString();
    let backendSaved = false;
    let activeStorage: 'fs' | 'blob' | 'client' = 'client';

    try {
      const config = await fetchShareConfig();
      if (config.storage === 'blob' && config.blobConfigured) {
        const blobResult = await saveSurpriseShareViaBlob({
          slug: resolvedSlug,
          payload: params.payload,
          editToken: meta.editToken,
        });
        if (blobResult.slug) resolvedSlug = blobResult.slug;
        if (blobResult.savedAt) savedAt = blobResult.savedAt;
        backendSaved = true;
        activeStorage = 'blob';
      } else if (config.storage === 'fs') {
        const fsResult = await saveSurpriseShareViaFilesystem({
          slug: resolvedSlug,
          payload: params.payload,
          editToken: meta.editToken,
        });
        if (fsResult.slug) resolvedSlug = fsResult.slug;
        if (fsResult.savedAt) savedAt = fsResult.savedAt;
        backendSaved = true;
        activeStorage = 'fs';
      }
    } catch (saveErr) {
      console.warn('Backend storage unavailable, using client-encoded share link:', saveErr);
    }

    const nextMeta: LocalShareMeta = {
      editToken: meta.editToken,
      savedSlug: resolvedSlug,
      savedAt,
      encodedPayload,
      storageMode: activeStorage,
      backendSaved,
    };
    saveLocalShareMeta(nextMeta);

    const shareUrl = buildShareUrl(resolvedSlug, encodedPayload);

    return {
      slug: resolvedSlug,
      savedAt,
      shareUrl,
    };
  } catch (fatalErr) {
    console.error('Fatal error in saveSurpriseShare:', fatalErr);
    const fallbackSlug = `sweet-surprise-${Math.random().toString(36).slice(2, 7)}`;
    const fallbackUrl = `${getPublicShareOrigin()}/s/${fallbackSlug}`;
    return {
      slug: fallbackSlug,
      savedAt: new Date().toISOString(),
      shareUrl: fallbackUrl,
    };
  }
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

  // 2. Fetch from Express dev/production server (/api/shares/:slug)
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

  // 3. Fetch from Vercel serverless endpoint (/api/share-get?slug=...)
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

  // 4. Local creator fallback (if opened on creator's machine where it was saved)
  const localMeta = loadLocalShareMeta();
  if (
    localMeta.savedSlug &&
    (localMeta.savedSlug.toLowerCase() === slug.toLowerCase() || slug === 'surprise')
  ) {
    if (localMeta.encodedPayload) {
      const localPayload = await decompressPayload(localMeta.encodedPayload);
      if (localPayload) {
        return {
          slug,
          savedAt: localMeta.savedAt || new Date().toISOString(),
          payload: localPayload,
        };
      }
    }
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
