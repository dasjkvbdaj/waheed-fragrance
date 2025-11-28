import { NextResponse } from 'next/server';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export async function POST() {
  try {
    // Sign out from Firebase
    await signOut(auth);

    const res = NextResponse.json({ ok: true });

    // Clear cookie
    res.cookies.set('user', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    return res;
  } catch (error) {
    console.error('Logout error:', error);

    // Even if Firebase signOut fails, clear the cookie
    const res = NextResponse.json({ ok: true });
    res.cookies.set('user', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    return res;
  }
}
