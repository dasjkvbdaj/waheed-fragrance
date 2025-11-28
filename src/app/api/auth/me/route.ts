import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/user=([^;]+)/);
    if (!match) return NextResponse.json({ user: null });
    const raw = decodeURIComponent(match[1]);
    const user = JSON.parse(raw);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
