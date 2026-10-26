import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  normalizeEditToken,
  sanitizeSlug,
  shareBlobPathname,
} from '../lib/shareHelpers';
import { readShareFromBlob } from '../lib/blobShareStore';

/**
 * Client-side upload token endpoint for large surprise payloads (photos + music).
 * Avoids Vercel's ~4.5MB serverless request body limit.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(503).json({
      error:
        'Share storage is not configured. In the Vercel dashboard, open Storage → create a Blob store → connect it to this project, then redeploy.',
    });
    return;
  }

  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      // @vercel/node request is compatible with handleUpload's request shape
      request: req as unknown as Request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let parsed: { editToken?: string; slug?: string } = {};
        try {
          parsed = clientPayload ? (JSON.parse(clientPayload) as typeof parsed) : {};
        } catch {
          throw new Error('Invalid upload session.');
        }

        const editToken = normalizeEditToken(parsed.editToken);
        const slug = sanitizeSlug(parsed.slug);
        if (!editToken || !slug) {
          throw new Error('Missing editor session or link name.');
        }

        const expectedPath = shareBlobPathname(slug);
        if (pathname !== expectedPath) {
          throw new Error('Upload path does not match the share link name.');
        }

        const existing = await readShareFromBlob(slug);
        if (existing?.editToken && existing.editToken !== editToken) {
          throw new Error(
            'This custom link name is already taken. Try making it unique (for example, add initials or a special date)!'
          );
        }

        return {
          allowedContentTypes: ['application/json', 'text/plain'],
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: false,
          allowOverwrite: true,
          tokenPayload: JSON.stringify({ slug, editToken }),
        };
      },
      onUploadCompleted: async () => {
        // Record is fully self-contained in the uploaded JSON.
      },
    });

    res.status(200).json(jsonResponse);
  } catch (err) {
    console.error('Share upload token failed:', err);
    res.status(400).json({
      error: err instanceof Error ? err.message : 'Could not prepare share upload.',
    });
  }
}
