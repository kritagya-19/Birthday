import express from 'express';
import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.PORT) || 3000;
const SHARES_DIR = path.join(process.cwd(), 'data', 'shares');

fs.mkdirSync(SHARES_DIR, { recursive: true });

function sanitizeSlug(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

function generateRandomSlug(): string {
  const words = ['sweet', 'lovely', 'forever', 'happy', 'heart', 'date', 'dreamy', 'darling'];
  const pick = words[Math.floor(Math.random() * words.length)];
  const code = Math.random().toString(36).slice(2, 7);
  return `${pick}-surprise-${code}`;
}

function getShareFilePath(slug: string): string {
  return path.join(SHARES_DIR, `${slug}.json`);
}

interface StoredShareRecord {
  slug: string;
  editToken: string;
  savedAt: string;
  payload: unknown;
}

async function startServer() {
  const app = express();

  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
  });

  app.use(express.json({ limit: '65mb' }));
  app.use(express.urlencoded({ extended: true, limit: '65mb' }));

  app.get('/api/share-config', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ storage: 'fs', blobConfigured: false });
  });

  app.post(['/api/shares', '/api/share-save'], (req: Request, res: Response) => {
    try {
      const body = req.body as {
        slug?: string;
        editToken?: string;
        payload?: unknown;
        allocateOnly?: boolean;
      };

      const editToken =
        typeof body?.editToken === 'string' && body.editToken.trim().length >= 8
          ? body.editToken.trim().slice(0, 128)
          : '';

      if (!editToken) {
        res.status(400).json({ error: 'Missing editor session token.' });
        return;
      }

      let slug = sanitizeSlug(body?.slug);
      if (!slug) {
        slug = generateRandomSlug();
        while (fs.existsSync(getShareFilePath(slug))) {
          slug = generateRandomSlug();
        }
      } else if (slug.length < 2) {
        res.status(400).json({
          error: 'Custom link name must be at least 2 characters (letters, numbers, or hyphens).',
        });
        return;
      }

      const targetPath = getShareFilePath(slug);
      if (fs.existsSync(targetPath)) {
        try {
          const existingRaw = fs.readFileSync(targetPath, 'utf-8');
          const existing = JSON.parse(existingRaw) as Partial<StoredShareRecord>;
          if (existing.editToken && existing.editToken !== editToken) {
            res.status(409).json({
              error:
                'This custom link name is already taken. Try making it unique (for example, add initials or a special date)!',
            });
            return;
          }
        } catch {
          // Allow overwrite if corrupted
        }
      }

      if (body?.allocateOnly) {
        res.json({ slug, savedAt: new Date().toISOString(), upload: 'client' });
        return;
      }

      if (!body || typeof body.payload !== 'object' || body.payload === null) {
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

      const tempPath = `${targetPath}.${process.pid}.${Date.now()}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(record), 'utf-8');
      fs.renameSync(tempPath, targetPath);

      res.json({ slug, savedAt });
    } catch (err) {
      console.error('Failed to save shared surprise:', err);
      res.status(500).json({ error: 'Could not save surprise right now. Please try again.' });
    }
  });

  app.get(['/api/shares/:slug', '/api/share-get'], (req: Request, res: Response) => {
    try {
      const slug = sanitizeSlug(req.params.slug || req.query.slug);
      if (!slug) {
        res.status(400).json({ error: 'Invalid surprise link.' });
        return;
      }

      const targetPath = getShareFilePath(slug);
      if (!fs.existsSync(targetPath)) {
        res.status(404).json({ error: 'Surprise link not found.' });
        return;
      }

      const raw = fs.readFileSync(targetPath, 'utf-8');
      const record = JSON.parse(raw) as StoredShareRecord;

      res.setHeader('Cache-Control', 'no-store');
      res.json({
        slug: record.slug,
        savedAt: record.savedAt,
        payload: record.payload,
      });
    } catch (err) {
      console.error('Failed to read shared surprise:', err);
      res.status(500).json({ error: 'Failed to load surprise.' });
    }
  });

  const distPath = path.join(process.cwd(), 'dist');
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.npm_lifecycle_event === 'start';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  Scrapbook Mail server running at:`);
    console.log(`  > Local:   http://localhost:${PORT}`);
    console.log(`  > Network: http://127.0.0.1:${PORT}\n`);
  });
}

startServer();
