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

    // Use Firebase REST API for server-side authentication
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
      // Check for specific Firebase error codes
      if (authData.error && authData.error.message === 'EMAIL_NOT_FOUND') {
        // Allow guest login for emails not in Firebase
        const guestUser = {
          id: 'guest_' + Date.now(),
          email: email,
          role: 'user'
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

      console.error('Firebase Auth error:', authData);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const firebaseUid = authData.localId;

    // Get user role from Firestore
    const userDocRef = doc(db, 'users', firebaseUid);
    const userDoc = await getDoc(userDocRef);

    let role = 'user';

    if (userDoc.exists()) {
      const userData = userDoc.data();
      role = userData.role || 'user';
    } else {
      // If user document doesn't exist in Firestore, create it with default role
      await setDoc(userDocRef, {
        email: email,
        role: 'user',
      });
    }

    const userData = {
      id: firebaseUid,
      email: email,
      role: role
    };

    const res = NextResponse.json({ user: userData });

    // Set cookie for session management
    res.cookies.set('user', JSON.stringify(userData), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return res;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 400 });
  }
}
