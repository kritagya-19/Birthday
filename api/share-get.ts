import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sanitizeSlug } from '../lib/shareHelpers';
import { isBlobConfigured, readShareFromBlob } from '../lib/blobShareStore';

/**
 * GET /api/share-get?slug=... — public partner view payload (no editToken).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    if (!isBlobConfigured()) {
      res.status(503).json({
        error:
          'Share storage is not configured on this deployment. Connect Vercel Blob and redeploy.',
      });
      return;
    }

    const rawSlug = typeof req.query.slug === 'string' ? req.query.slug : '';
    const slug = sanitizeSlug(rawSlug);
    if (!slug) {
      res.status(400).json({ error: 'Invalid surprise link.' });
      return;
    }

    const record = await readShareFromBlob(slug);
    if (!record) {
      res.status(404).json({ error: 'Surprise link not found.' });
      return;
    }

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      slug: record.slug,
      savedAt: record.savedAt,
      payload: record.payload,
    });
  } catch (err) {
    console.error('Failed to read shared surprise:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to load surprise.',
    });
  }
}
