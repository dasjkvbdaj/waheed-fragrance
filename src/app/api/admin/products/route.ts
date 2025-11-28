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

export async function GET() {
  try {
    await dbConnect();
    // Fetch all perfumes
    // Filter out 'Amber Noir' as per original logic if needed, or just fetch all.
    // The original logic filtered it out.
    let perfumes = await Perfume.find({ name: { $ne: 'Amber Noir' } }).sort({ createdAt: -1 }).lean();

    // Map _id to id for frontend compatibility
    perfumes = perfumes.map((p: any) => ({
      ...p,
      id: p._id.toString(),
      _id: undefined
    }));

    return NextResponse.json({ products: perfumes });
  } catch (err) {
    console.error('Error fetching perfumes:', err);
    return NextResponse.json({ products: [] });
  }
}

export async function POST(req: Request) {
  // Server-side check: only ADMIN allowed
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  try {
    await dbConnect();
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
          const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
          const out = path.join(UPLOAD_DIR, filename);
          await fs.writeFile(out, Buffer.from(base64, 'base64'));
          imagePath = `/uploads/${filename}`;
        }
      } catch (e) {
        // ignore but proceed
      }
    }

    const newItem = await Perfume.create({
      name: payload.name || 'Untitled',
      sizes: payload.sizes || [],
      category: payload.category || 'unisex',
      image: imagePath,
      description: payload.description || '',
      notes: payload.notes || '',
    });

    return NextResponse.json({ product: newItem }, { status: 201 });
  } catch (err) {
    console.error('Error creating perfume:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
