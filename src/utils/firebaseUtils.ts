import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

/**
 * Uploads an image file to Firebase Storage and returns the download URL.
 * @param file The file to upload.
 * @param path The path in storage (default: 'products').
 * @returns The download URL of the uploaded image.
 */
export const uploadImage = async (file: File, path: string = "products"): Promise<string> => {
  try {
    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `${path}/${uniqueName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};
