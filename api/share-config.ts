import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Lets the browser know how shares are stored in this deployment.
 * Local Express returns { storage: "fs" }; Vercel returns { storage: "blob" }.
 */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    storage: 'blob',
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  });
}
