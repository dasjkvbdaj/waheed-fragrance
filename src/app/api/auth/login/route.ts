import { NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Check if this is the specific Admin account
    if (email === 'admin@example.com') {
      // --- ADMIN LOGIN FLOW (Firebase Auth) ---
      const FIREBASE_API_KEY = "AIzaSyCUbB-RryWiUw7rBOk7dwirbJBIZTU2mwM";
      const authResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        console.error('Admin Login Failed:', authData);
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const firebaseUid = authData.localId;

      // Ensure Admin Role in Firestore
      const userDocRef = doc(db, 'users', firebaseUid);
      const userDoc = await getDoc(userDocRef);
      let role = 'ADMIN'; // Default to ADMIN for this specific email

      if (userDoc.exists()) {
        const userData = userDoc.data();
        role = userData.role || 'ADMIN';
      } else {
        await setDoc(userDocRef, {
          email: email,
          role: 'ADMIN',
        });
      }

      const adminUser = {
        id: firebaseUid,
        email: email,
        role: role
      };

      const res = NextResponse.json({ user: adminUser });
      res.cookies.set('user', JSON.stringify(adminUser), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      return res;

    } else {
      // --- GUEST LOGIN FLOW (Skip Firebase) ---
      // Any other email is treated as a Guest User immediately

      const guestUser = {
        id: 'guest_' + Date.now(),
        email: email,
        role: 'user' // lowercase 'user' as per previous convention
      };

      const res = NextResponse.json({ user: guestUser });
      res.cookies.set('user', JSON.stringify(guestUser), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      return res;
    }

  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 400 });
  }
}
