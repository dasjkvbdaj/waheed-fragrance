import { NextResponse } from 'next/server';
import { USERS } from '@/data/users';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Ensure a simple users table exists in the local sqlite DB and seed the default admin if missing
    try {
      await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, password TEXT, role TEXT, createdAt TEXT DEFAULT CURRENT_TIMESTAMP)`);
    } catch (e) {
      // ignore if DDL fails for whatever reason
    }

    // Make sure admin user exists in DB (migrate from demo file to DB by default)
    try {
      const dbRows: any[] = await prisma.$queryRaw`SELECT id, email, password, role FROM users WHERE email = 'admin@example.com' LIMIT 1`;
      const dbAdmin = dbRows && dbRows[0] ? dbRows[0] : undefined;
      if (!dbAdmin) {
        // find admin credentials in the demo file and insert
        const demoAdmin = USERS.find(u => u.email === 'admin@example.com');
        const id = demoAdmin?.id ?? crypto.randomUUID();
        const emailVal = demoAdmin?.email ?? 'admin@example.com';
        const passVal = demoAdmin?.password ?? 'adminpass';
        const roleVal = demoAdmin?.role ?? 'ADMIN';
        await prisma.$executeRaw`INSERT OR IGNORE INTO users (id, email, password, role) VALUES (${id}, ${emailVal}, ${passVal}, ${roleVal})`;
      }
    } catch (e) {
      // ignore DB seeding errors — fallback to demo file below
    }

    // Try DB auth first
    let found: any = undefined;
    try {
      const rows: any[] = await prisma.$queryRaw`
        SELECT id, email, password, role FROM users WHERE email = ${email} LIMIT 1
      `;
      found = rows && rows[0] ? rows[0] : undefined;
    } catch (e) {
      found = undefined;
    }

    // If the account is an ADMIN in DB, require correct password (strict)
    if (found && found.role === 'ADMIN') {
      if (found.password !== password) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    }

    // For non-admin: if user exists in DB, accept any password (demo behavior says allow any)
    // If not found, create a new user record (store it so it's persisted)
    if (!found) {
      try {
        const id = crypto.randomUUID();
        await prisma.$executeRaw`
          INSERT INTO users (id, email, password, role) VALUES (${id}, ${email}, ${password}, ${'USER'})
        `;
        const rows: any[] = await prisma.$queryRaw`SELECT id, email, role FROM users WHERE id = ${id} LIMIT 1`;
        found = rows && rows[0] ? rows[0] : { id, email, role: 'USER' };
      } catch (e) {
        // if DB insert failed, fall back to accepting the login in-memory (no DB row)
        found = { id: crypto.randomUUID(), email, role: 'USER' };
      }
    }

    const user = { id: found.id, email: found.email, role: found.role };

    const res = NextResponse.json({ user });
    // Store a simple cookie for `me` endpoint — make it safer for demo (HttpOnly, SameSite)
    // NOTE: For a real application, store session tokens or use a secure auth provider.
    res.cookies.set('user', JSON.stringify(user), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
