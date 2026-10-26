import { list, put } from '@vercel/blob';
import {
  type StoredShareRecord,
  sanitizeSlug,
  shareBlobPathname,
} from './shareHelpers.ts';

/** True when a Blob store is connected (legacy RW token or current OIDC store id). */
export function isBlobConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)
  );
}

export function assertBlobConfigured(): void {
  if (!isBlobConfigured()) {
    throw new Error(
      'Share storage is not configured. In the Vercel dashboard, open Storage → create a Blob store → connect it to this project, then redeploy.'
    );
  }
}

export async function readShareFromBlob(slug: string): Promise<StoredShareRecord | null> {
  if (!isBlobConfigured()) return null;

  try {
    const pathname = shareBlobPathname(slug);
    const { blobs } = await list({ prefix: pathname, limit: 20 });
    const match = blobs.find((b) => b.pathname === pathname);
    if (!match) return null;

    const res = await fetch(match.url, { cache: 'no-store' });
    if (!res.ok) return null;

    const record = (await res.json()) as Partial<StoredShareRecord>;
    if (!record || typeof record.payload !== 'object' || record.payload === null) {
      return null;
    }

    return {
      slug: sanitizeSlug(record.slug) || slug,
      editToken: typeof record.editToken === 'string' ? record.editToken : '',
      savedAt: typeof record.savedAt === 'string' ? record.savedAt : '',
      payload: record.payload,
    };
  } catch (err) {
    console.error('Failed to read share from Blob:', err);
    return null;
  }
}

export async function writeShareToBlob(record: StoredShareRecord): Promise<void> {
  assertBlobConfigured();
  await put(shareBlobPathname(record.slug), JSON.stringify(record), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}
