import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        // Build Firestore query
        const productsRef = collection(db, 'products');
        let q;

        if (category && category !== 'all') {
            // Filter by category - no orderBy to ensure all products are fetched
            q = query(
                productsRef,
                where('category', '==', category)
            );
        } else {
            // Get all products without orderBy constraint
            q = query(productsRef);
        }

        const querySnapshot = await getDocs(q);

        // Map Firestore documents to product objects
        let perfumes = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filter out demo product "Amber Noir"
        perfumes = perfumes.filter((p: any) =>
            String(p.name).toLowerCase() !== 'amber noir'
        );

        // Sort by createdAt in memory (newest first), handling missing createdAt
        perfumes.sort((a: any, b: any) => {
            const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
            const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
            return bTime - aTime;
        });

        return NextResponse.json({ perfumes });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
