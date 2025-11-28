import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Perfume } from '@/types';

const DB_FILE = path.join(process.cwd(), 'src', 'data', 'adminProducts.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function requireAdmin(request: Request) {
  try {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/user=([^;]+)/);
    if (!match) return false;
    const raw = decodeURIComponent(match[1]);
    const user = JSON.parse(raw);
    return user && user.role === 'ADMIN';
  } catch (e) {
    return false;
  }
}

async function readDB(): Promise<Perfume[]> {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(raw) as Perfume[];
  } catch (err) {
    return [];
  }
}

async function writeDB(data: Perfume[]) {
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  const data = await readDB();
  // Permanently remove any demo item named 'Amber Noir' from the admin DB
  let filtered = data.filter((p) => String(p.name).toLowerCase() !== 'amber noir');

  // Also filter out any id present in deletedProducts.json and persist if we removed any
  try {
    const deletedFile = path.join(process.cwd(), 'src', 'data', 'deletedProducts.json');
    const raw = await fs.readFile(deletedFile, 'utf8');
    const deletedIds: string[] = JSON.parse(raw || '[]');
    if (Array.isArray(deletedIds) && deletedIds.length > 0) {
      const before = filtered.length;
      filtered = filtered.filter((p) => !deletedIds.includes(String(p.id)));
      if (filtered.length !== before) {
        await writeDB(filtered);
      }
    }
  } catch (e) {
    // ignore
  }

  return NextResponse.json({ products: filtered });
}

export async function POST(req: Request) {
  // Server-side check: only ADMIN allowed
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  try {
    const payload = await req.json();
    // validate required fields
    if (!payload.name || !Array.isArray(payload.sizes) || payload.sizes.length === 0) {
      return NextResponse.json({ error: 'Missing required fields: name and sizes' }, { status: 400 });
    }

    // sanitize and normalize
    const sanitize = (s: any) => String(s ?? '').replace(/[<>]/g, '');
    payload.name = sanitize(payload.name);

    // Disallow creating the demo product
    if (String(payload.name).toLowerCase() === 'amber noir') {
      return NextResponse.json({ error: "Adding this demo product is not allowed." }, { status: 400 });
    }
    payload.category = sanitize(payload.category || 'unisex');
    payload.description = payload.description ? sanitize(payload.description) : '';
    payload.notes = payload.notes ? sanitize(payload.notes) : '';
    payload.sizes = (payload.sizes || []).map((si: any) => ({ size: sanitize(si.size), price: Number(si.price || 0) }));

    // Handle base64 image upload
    let imagePath = payload.image || '/placeholder.jpg';
    if (payload.imageData && typeof payload.imageData === 'string') {
      try {
        const matches = payload.imageData.match(/^data:(image\/\w+);base64,(.+)$/);
        if (matches) {
          const mime = matches[1];
          const base64 = matches[2];
          const ext = mime.split('/')[1];
          await fs.mkdir(UPLOAD_DIR, { recursive: true });
          const filename = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
          const out = path.join(UPLOAD_DIR, filename);
          await fs.writeFile(out, Buffer.from(base64, 'base64'));
          imagePath = `/uploads/${filename}`;
        }
      } catch (e) {
        // ignore but proceed
      }
    }
    const data = await readDB();
    const id = Date.now().toString();
    const newItem: any = {
      id,
      name: payload.name || 'Untitled',
      sizes: payload.sizes || [],
      category: payload.category || 'unisex',
      image: imagePath,
      description: payload.description || '',
      notes: payload.notes || '',
    } as Perfume;

    data.unshift(newItem);
    await writeDB(data);
    return NextResponse.json({ product: newItem }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
