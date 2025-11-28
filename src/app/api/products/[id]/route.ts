import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Perfume from '@/models/Perfume';

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        // Try to find product by ID
        let perfume: any = null;
        try {
            perfume = await Perfume.findById(params.id).lean();
            if (perfume) {
                perfume.id = perfume._id.toString();
                delete perfume._id;
            }
        } catch (e) {
            // If ID is not a valid ObjectId, findById throws
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // If product not found in DB, try adminProducts.json fallback
        if (!perfume) {
            try {
                const fs = await import('fs/promises');
                const path = await import('path');
                const DB_FILE = path.join(process.cwd(), 'src', 'data', 'adminProducts.json');
                const raw = await fs.readFile(DB_FILE, 'utf8');
                const data = JSON.parse(raw || '[]');
                if (Array.isArray(data)) {
                    const found = data.find((p: any) => String(p.id) === String(params.id));
                    if (found) {
                        perfume = {
                            ...found,
                            sizes: (found.sizes || []).map((s: any) => ({ size: s.size, price: Number(s.price || 0) })),
                        };
                    }
                }
            } catch (e) {
                // Ignore file read errors
            }
        }

        if (!perfume) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Filter out demo product
        if (perfume && String(perfume.name).toLowerCase() === 'amber noir') {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check deleted products list
        try {
            const fsp = await import('fs/promises');
            const pth = await import('path');
            const deletedRaw = await fsp.readFile(pth.join(process.cwd(), 'src', 'data', 'deletedProducts.json'), 'utf8');
            const deletedIds = JSON.parse(deletedRaw || '[]');
            if (Array.isArray(deletedIds) && deletedIds.includes(String(perfume.id))) {
                return NextResponse.json(
                    { error: 'Product not found' },
                    { status: 404 }
                );
            }
        } catch { }

        // Fetch related products (same category, excluding current)
        let relatedPerfumes: any[] = await Perfume.find({
            category: perfume.category,
            _id: { $ne: params.id },
        }).limit(4).lean();

        relatedPerfumes = relatedPerfumes.map((p: any) => {
            p.id = p._id.toString();
            delete p._id;
            return p;
        });

        // Remove deleted ids and demo product from related list
        try {
            const fsp = await import('fs/promises');
            const pth = await import('path');
            const deletedRaw = await fsp.readFile(pth.join(process.cwd(), 'src', 'data', 'deletedProducts.json'), 'utf8');
            const deletedIds = JSON.parse(deletedRaw || '[]');
            if (Array.isArray(deletedIds) && deletedIds.length > 0) {
                relatedPerfumes = relatedPerfumes.filter((p: any) => !deletedIds.includes(String(p.id)));
            }
        } catch { }
        relatedPerfumes = relatedPerfumes.filter((p: any) => String(p.name).toLowerCase() !== 'amber noir');

        return NextResponse.json({ perfume, relatedPerfumes });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}
