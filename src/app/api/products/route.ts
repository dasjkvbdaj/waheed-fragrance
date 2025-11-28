import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Perfume from '@/models/Perfume';

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        // Build query
        const query: any = {
            name: { $ne: 'Amber Noir' } // Filter out demo product
        };

        if (category && category !== 'all') {
            query.category = category;
        }

        // Fetch perfumes from MongoDB
        let perfumes = await Perfume.find(query).sort({ createdAt: -1 }).lean();

        // Map _id to id for frontend compatibility
        perfumes = perfumes.map((p: any) => ({
            ...p,
            id: p._id.toString(),
            _id: undefined
        }));

        return NextResponse.json({ perfumes });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
