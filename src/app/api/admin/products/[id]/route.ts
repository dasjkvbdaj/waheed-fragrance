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

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await readDB();
  const item = data.find((p) => p.id === id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product: item });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  try {
    const payload = await req.json();
    // sanitize
    const sanitize = (s: any) => String(s ?? '').replace(/[<>]/g, '');
    payload.name = sanitize(payload.name ?? '');
    payload.category = sanitize(payload.category ?? 'unisex');
    payload.description = payload.description ? sanitize(payload.description) : '';
    payload.notes = payload.notes ? sanitize(payload.notes) : '';
    if (Array.isArray(payload.sizes)) payload.sizes = payload.sizes.map((si: any) => ({ size: sanitize(si.size), price: Number(si.price || 0) }));
    const data = await readDB();
    const idx = data.findIndex((p) => p.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    // handle optional new imageData
    let imagePath = data[idx].image;
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
      } catch {}
    }

    const updated = { ...data[idx], ...payload, image: imagePath } as Perfume;
    data[idx] = updated;
    await writeDB(data);
    return NextResponse.json({ product: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const data = await readDB();
  const idx = data.findIndex((p) => p.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const removed = data.splice(idx, 1)[0];
  await writeDB(data);
  return NextResponse.json({ deleted: removed });
}
