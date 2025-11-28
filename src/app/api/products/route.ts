import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        // Build Firestore query
        const productsRef = collection(db, 'products');
        let q;

        if (category && category !== 'all') {
            // Filter by category and exclude demo product
            q = query(
                productsRef,
                where('category', '==', category),
                orderBy('createdAt', 'desc')
            );
        } else {
            // Get all products, ordered by creation date
            q = query(productsRef, orderBy('createdAt', 'desc'));
        }

        const querySnapshot = await getDocs(q);

        // Map Firestore documents to product objects
        let perfumes = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filter out demo product "Amber Noir" (client-side filter since we can't combine != with orderBy)
        perfumes = perfumes.filter((p: any) =>
            String(p.name).toLowerCase() !== 'amber noir'
        );

        return NextResponse.json({ perfumes });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
