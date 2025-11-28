import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Clear cookie, matching same options used when setting it
  res.cookies.set('user', '', { path: '/', maxAge: 0, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  return res;
}
