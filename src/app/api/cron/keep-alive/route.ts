import { NextResponse } from 'next/server';
import { supabase, storageBucket } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // List files in the storage bucket to generate activity
        // We limit to 1 file to keep it extremely lightweight
        const { data, error } = await supabase.storage
            .from(storageBucket)
            .list('', { limit: 1 });

        if (error) {
            console.error('Cron Keep-Alive Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Supabase storage pinged successfully',
            data_length: data?.length
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
