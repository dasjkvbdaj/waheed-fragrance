import { NextResponse } from 'next/server';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Fetch product by ID from Firestore
        const productRef = doc(db, 'products', params.id);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        let perfume: any = {
            id: productSnap.id,
            ...productSnap.data()
        };

        // Filter out demo product
        if (String(perfume.name).toLowerCase() === 'amber noir') {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Fetch related products (same category, excluding current)
        const relatedQuery = query(
            collection(db, 'products'),
            where('category', '==', perfume.category),
            limit(5) // Get 5 to ensure we have 4 after filtering out current product
        );

        const relatedSnapshot = await getDocs(relatedQuery);
        let relatedPerfumes = relatedSnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter((p: any) =>
                p.id !== params.id && // Exclude current product
                String(p.name).toLowerCase() !== 'amber noir' // Exclude demo product
            )
            .slice(0, 4); // Limit to 4 related products

        return NextResponse.json({ perfume, relatedPerfumes });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}
