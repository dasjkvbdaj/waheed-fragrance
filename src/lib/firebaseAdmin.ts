// Firebase Server-Side Helper Functions
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Check if the request has admin authorization
 * Reads user from cookie and verifies role in Firestore
 */
export async function requireAdmin(request: Request): Promise<boolean> {
    try {
        const cookie = request.headers.get('cookie') || '';
        const match = cookie.match(/user=([^;]+)/);
        if (!match) return false;

        const raw = decodeURIComponent(match[1]);
        const user = JSON.parse(raw);

        if (!user || !user.id) return false;

        // Verify role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.id));
        if (!userDoc.exists()) return false;

        const userData = userDoc.data();
        return (userData.role || '').toLowerCase() === 'admin';
    } catch (e) {
        console.error('Admin check error:', e);
        return false;
    }
}

/**
 * Get user role from Firestore
 */
export async function getUserRole(uid: string): Promise<string | null> {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (!userDoc.exists()) return null;

        const userData = userDoc.data();
        return userData.role || 'user';
    } catch (e) {
        console.error('Get user role error:', e);
        return null;
    }
}

/**
 * Upload base64 image to Firebase Storage
 * Returns the download URL
 */
export async function uploadImageToStorage(base64Data: string): Promise<string | null> {
    try {
        const matches = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!matches) return null;

        const mime = matches[1];
        const base64 = matches[2];
        const ext = mime.split('/')[1];

        // Create unique filename
        const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        // Convert base64 to buffer
        const buffer = Buffer.from(base64, 'base64');

        // Upload to Firebase Storage
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, buffer, { contentType: mime });

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (e) {
        console.error('Image upload error:', e);
        return null;
    }
}
