import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Perfume } from '@/types';
import prisma from '@/lib/prisma';

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
  // treat demo product as removed
  if (String(item.name).toLowerCase() === 'amber noir') return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product: item });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  try {
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
  // If the item exists in the admin JSON store, remove it and persist.
  let removed: Perfume | undefined = undefined;
  if (idx !== -1) {
    removed = data.splice(idx, 1)[0];
    await writeDB(data);
  }

  // Persist deletion in deletedProducts.json so pages will always hide it
  try {
    const deletedFile = path.join(process.cwd(), 'src', 'data', 'deletedProducts.json');
    let deleted: string[] = [];
    try {
      const raw = await fs.readFile(deletedFile, 'utf8');
      deleted = JSON.parse(raw || '[]');
    } catch {}
    if (!deleted.includes(params.id)) {
      deleted.push(params.id);
      await fs.writeFile(deletedFile, JSON.stringify(deleted, null, 2), 'utf8');
    }
  } catch (e) {
    // non-fatal
  }

  // If it wasn't present in the JSON store, we'll still attempt to delete from DB below.

  // Also try to delete the product from the DB if Prisma is available.
  try {
    // If Prisma client has a model-level delete method, call it.
    if (prisma && prisma.perfume && typeof prisma.perfume.delete === 'function') {
      // If administrative JSON removed the product, delete from DB too using the model API
      await prisma.perfume.delete({ where: { id: params.id } }).catch(() => {});
    } else if (prisma && typeof prisma.$executeRaw === 'function') {
      // Try parameterized raw SQL (safer than unsafe interpolation). Try a few likely table names.
      try {
        await prisma.$executeRaw`DELETE FROM perfume WHERE id = ${params.id}`;
      } catch (e1) {
        try {
          await prisma.$executeRaw`DELETE FROM perfumes WHERE id = ${params.id}`;
        } catch (e2) {
          try {
            // Prisma schema might use a PascalCase table name or different naming — try Perfume
            await prisma.$executeRaw`DELETE FROM "Perfume" WHERE id = ${params.id}`;
          } catch (e3) {
            // ignore if table doesn't exist or raw fails
          }
        }
      }
    }
  } catch (e) {
    // ignore DB deletion errors — main data file deletion was successful
  }

  // If the item wasn't present in the admin JSON but may exist only in DB, attempt DB-only deletion
  if (!removed) {
    try {
      if (prisma && prisma.perfume && typeof prisma.perfume.delete === 'function') {
        const dbDeleted = await prisma.perfume.delete({ where: { id: params.id } }).catch(() => null);
        if (dbDeleted) removed = dbDeleted as Perfume;
      } else if (prisma && typeof prisma.$executeRaw === 'function') {
        try {
          await prisma.$executeRaw`DELETE FROM perfume WHERE id = ${params.id}`;
          removed = { id: params.id } as Perfume;
        } catch (e) {
          try { await prisma.$executeRaw`DELETE FROM perfumes WHERE id = ${params.id}`; removed = { id: params.id } as Perfume; } catch (e2) {
            try { await prisma.$executeRaw`DELETE FROM "Perfume" WHERE id = ${params.id}`; removed = { id: params.id } as Perfume; } catch {}
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }
  if (!removed) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ deleted: removed });
}
