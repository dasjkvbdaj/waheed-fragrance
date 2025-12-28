import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    // Example: Fetching a collection called 'products'
    // You can replace 'products' with any collection name you want to monitor or update
    const querySnapshot = await getDocs(collection(db, "products"));

    // Log how many documents we found (visible in Vercel logs)
    console.log(`Cron job ran at ${new Date().toISOString()}. Found ${querySnapshot.size} products.`);

    return NextResponse.json({
      success: true,
      count: querySnapshot.size,
      timestamp: new Date().toISOString(),
      message: 'Database check complete'
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch from database' },
      { status: 500 }
    );
  }
}
