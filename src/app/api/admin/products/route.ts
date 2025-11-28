import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { requireAdmin, uploadImageToStorage } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    // Fetch all products from Firestore
    const productsRef = collection(db, 'products');
    const q = query(productsRef);
    const querySnapshot = await getDocs(q);

    let perfumes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filter out demo product "Amber Noir"
    perfumes = perfumes.filter((p: any) =>
      String(p.name).toLowerCase() !== 'amber noir'
    );

    return NextResponse.json({ products: perfumes });
  } catch (err) {
    console.error('Error fetching perfumes:', err);
    return NextResponse.json({ products: [] });
  }
}

export async function POST(req: Request) {
  // Server-side check: only ADMIN allowed
  const isAdmin = await requireAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const payload = await req.json();

    // Validate required fields
    if (!payload.name || !Array.isArray(payload.sizes) || payload.sizes.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: name and sizes' },
        { status: 400 }
      );
    }

    // Sanitize and normalize
    const sanitize = (s: any) => String(s ?? '').replace(/[<>]/g, '');
    payload.name = sanitize(payload.name);

    // Disallow creating the demo product
    if (String(payload.name).toLowerCase() === 'amber noir') {
      return NextResponse.json(
        { error: 'Adding this demo product is not allowed.' },
        { status: 400 }
      );
    }

    payload.category = sanitize(payload.category || 'unisex');
    payload.description = payload.description ? sanitize(payload.description) : '';
    payload.notes = payload.notes ? sanitize(payload.notes) : '';
    payload.sizes = (payload.sizes || []).map((si: any) => ({
      size: sanitize(si.size),
      price: Number(si.price || 0)
    }));

    // Handle image upload to Firebase Storage
    let imagePath = payload.image || '/placeholder.jpg';

    if (payload.imageData && typeof payload.imageData === 'string') {
      const uploadedUrl = await uploadImageToStorage(payload.imageData);
      if (uploadedUrl) {
        imagePath = uploadedUrl;
      }
    }

    // Create product in Firestore
    const productsRef = collection(db, 'products');
    const newProduct = {
      name: payload.name || 'Untitled',
      sizes: payload.sizes || [],
      category: payload.category || 'unisex',
      image: imagePath,
      description: payload.description || '',
      notes: payload.notes || ''
    };

    const docRef = await addDoc(productsRef, newProduct);

    return NextResponse.json({
      product: {
        id: docRef.id,
        ...newProduct
      }
    }, { status: 201 });
  } catch (err) {
    console.error('Error creating perfume:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
