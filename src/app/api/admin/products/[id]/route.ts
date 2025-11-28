import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import dbConnect from '@/lib/db';
import Perfume from '@/models/Perfume';

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

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    const item = await Perfume.findById(id);

    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    // treat demo product as removed
    if (String(item.name).toLowerCase() === 'amber noir') return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ product: item });
  } catch (err) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  try {
    await dbConnect();
    const payload = await req.json();
    // sanitize
    const sanitize = (s: any) => String(s ?? '').replace(/[<>]/g, '');
    payload.name = sanitize(payload.name ?? '');
    // Disallow editing a product to be the demo product
    if (String(payload.name).toLowerCase() === 'amber noir') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    payload.category = sanitize(payload.category ?? 'unisex');
    payload.description = payload.description ? sanitize(payload.description) : '';
    payload.notes = payload.notes ? sanitize(payload.notes) : '';
    if (Array.isArray(payload.sizes)) payload.sizes = payload.sizes.map((si: any) => ({ size: sanitize(si.size), price: Number(si.price || 0) }));

    const existing = await Perfume.findById(params.id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // handle optional new imageData
    let imagePath = existing.image;
    if (payload.imageData && typeof payload.imageData === 'string') {
      try {
        const matches = payload.imageData.match(/^data:(image\/\w+);base64,(.+)$/);
        if (matches) {
          const mime = matches[1];
          const base64 = matches[2];
          const ext = mime.split('/')[1];
          await fs.mkdir(UPLOAD_DIR, { recursive: true });
          const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
          const out = path.join(UPLOAD_DIR, filename);
          await fs.writeFile(out, Buffer.from(base64, 'base64'));
          imagePath = `/uploads/${filename}`;
        }
      } catch { }
    }

    const updated = await Perfume.findByIdAndUpdate(params.id, {
      ...payload,
      image: imagePath
    }, { new: true });

    return NextResponse.json({ product: updated });
  } catch (err) {
    console.error('Error updating perfume:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  try {
    await dbConnect();
    const removed = await Perfume.findByIdAndDelete(params.id);
    if (!removed) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ deleted: removed });
  } catch (err) {
    console.error('Error deleting perfume:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
