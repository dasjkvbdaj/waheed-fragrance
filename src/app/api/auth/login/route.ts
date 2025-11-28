import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, password } = body;

    // Demo admin shortcut: allow the demo admin to login even when DB is unavailable
    // For MongoDB, we will actually upsert this admin user if not found, or just check against DB.
    // But to keep the "demo" feel if DB is empty, we can seed it here or just check.

    // Check if user exists
    let user = await User.findOne({ email });

    // If admin@example.com doesn't exist, create it (seeding)
    if (!user && email === 'admin@example.com' && password === 'adminpass') {
      user = await User.create({
        email: 'admin@example.com',
        password: 'adminpass',
        role: 'ADMIN',
      });
    }

    if (!user) {
      // For this demo app, if user doesn't exist, we create a regular user
      // In a real app, you'd return "Invalid credentials" or have a register flow.
      // The original code created a user if not found.
      user = await User.create({
        email,
        password,
        role: 'USER',
      });
    }

    // Check password (simple string comparison as per original code)
    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const userData = { id: user._id.toString(), email: user.email, role: user.role };

    const res = NextResponse.json({ user: userData });

    res.cookies.set('user', JSON.stringify(userData), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
