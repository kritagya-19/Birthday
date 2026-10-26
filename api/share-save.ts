import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  type StoredShareRecord,
  generateRandomSlug,
  normalizeEditToken,
  sanitizeSlug,
} from '../lib/shareHelpers.ts';
import { isBlobConfigured, readShareFromBlob, writeShareToBlob } from '../lib/blobShareStore.ts';

/**
 * POST /api/share-save
 * Allocates a slug and (when payload is present) writes the surprise to Blob.
 * If Blob store is not configured, succeeds with storage: 'client' so the link works via URL encoding.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as {
      slug?: string;
      editToken?: string;
      payload?: unknown;
      allocateOnly?: boolean;
    };

    const editToken = normalizeEditToken(body?.editToken);
    if (!editToken) {
      res.status(400).json({ error: 'Missing editor session token.' });
      return;
    }

    let slug = sanitizeSlug(body?.slug);
    if (!slug) {
      slug = generateRandomSlug();
    } else if (slug.length < 2) {
      res.status(400).json({
        error: 'Custom link name must be at least 2 characters (letters, numbers, or hyphens).',
      });
      return;
    }

    if (!isBlobConfigured()) {
      // Graceful fallback: return 200 so the frontend generates the self-contained link
      res.status(200).json({
        slug,
        savedAt: new Date().toISOString(),
        storage: 'client',
        notice: 'Vercel Blob is not connected; surprise will be loaded directly from the link.',
      });
      return;
    }
    if (!slug) {
      slug = generateRandomSlug();
      for (let i = 0; i < 8; i++) {
        const existing = await readShareFromBlob(slug);
        if (!existing) break;
        slug = generateRandomSlug();
      }
    }

    const existing = await readShareFromBlob(slug);
    if (existing?.editToken && existing.editToken !== editToken) {
      res.status(409).json({
        error:
          'This custom link name is already taken. Try making it unique (for example, add initials or a special date)!',
      });
      return;
    }

    if (body?.allocateOnly || body?.payload == null) {
      res.status(200).json({
        slug,
        savedAt: existing?.savedAt || new Date().toISOString(),
        upload: 'client',
      });
      return;
    }

    if (typeof body.payload !== 'object') {
      res.status(400).json({ error: 'Invalid surprise payload.' });
      return;
    }

    const savedAt = new Date().toISOString();
    const record: StoredShareRecord = {
      slug,
      editToken,
      savedAt,
      payload: body.payload,
    };

    await writeShareToBlob(record);
    res.status(200).json({ slug, savedAt });
  } catch (err) {
    console.error('Failed to save shared surprise:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Could not save surprise right now. Please try again.',
    });
  }
}
