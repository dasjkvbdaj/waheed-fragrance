import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { requireAdmin, uploadImageToStorage } from '@/lib/firebaseAdmin';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const productRef = doc(db, 'products', params.id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const item = productSnap.data();

    // Treat demo product as removed
    if (String(item.name).toLowerCase() === 'amber noir') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      product: {
        id: productSnap.id,
        ...item
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const isAdmin = await requireAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const payload = await req.json();

    // Sanitize
    const sanitize = (s: any) => String(s ?? '').replace(/[<>]/g, '');
    payload.name = sanitize(payload.name ?? '');

    // Disallow editing a product to be the demo product
    if (String(payload.name).toLowerCase() === 'amber noir') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    payload.category = sanitize(payload.category ?? 'unisex');
    payload.description = payload.description ? sanitize(payload.description) : '';
    payload.notes = payload.notes ? sanitize(payload.notes) : '';

    if (Array.isArray(payload.sizes)) {
      payload.sizes = payload.sizes.map((si: any) => ({
        size: sanitize(si.size),
        price: Number(si.price || 0)
      }));
    }

    // Get existing product
    const productRef = doc(db, 'products', params.id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const existing = productSnap.data();

    // Handle optional new imageData
    let imagePath = existing.image;
    if (payload.imageData && typeof payload.imageData === 'string') {
      const uploadedUrl = await uploadImageToStorage(payload.imageData);
      if (uploadedUrl) {
        imagePath = uploadedUrl;
      }
    }

    // Update product in Firestore
    const updateData = {
      name: payload.name,
      sizes: payload.sizes,
      category: payload.category,
      description: payload.description,
      notes: payload.notes,
      image: imagePath,
      updatedAt: Timestamp.now()
    };

    await updateDoc(productRef, updateData);

    return NextResponse.json({
      product: {
        id: params.id,
        ...updateData
      }
    });
  } catch (err) {
    console.error('Error updating perfume:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const isAdmin = await requireAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const productRef = doc(db, 'products', params.id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await deleteDoc(productRef);

    return NextResponse.json({ deleted: { id: params.id } });
  } catch (err) {
    console.error('Error deleting perfume:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
