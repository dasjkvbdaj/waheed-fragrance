import { supabase, storageBucket } from "@/lib/supabase";

/**
 * Uploads an image file to Supabase Storage and returns the public URL.
 * @param file The file to upload.
 * @returns The public URL of the uploaded image.
 */
export const uploadImageToSupabase = async (file: File): Promise<string> => {
    if (!file) {
        throw new Error("No file provided");
    }

    try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        // Upload image to Supabase Storage
        const { error } = await supabase.storage
            .from(storageBucket)
            .upload(fileName, file);

        if (error) {
            console.error("Supabase upload error:", error);
            throw error;
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
            .from(storageBucket)
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    } catch (error) {
        console.error("Error uploading image to Supabase:", error);
        throw new Error("Failed to upload image");
    }
};

/**
 * Deletes an image file from Supabase Storage.
 * @param imageUrl The public URL of the image to delete.
 */
export const deleteImageFromSupabase = async (imageUrl: string): Promise<void> => {
    if (!imageUrl) return;

    try {
        // Extract the file path from the URL
        // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[fileName]
        // or potentially other formats, so be careful. 
        // We generally just need the part after the bucket name if using .from(bucket).

        // Simple check if it matches our storage bucket pattern to avoid deleting external images
        if (!imageUrl.includes(storageBucket)) {
            console.warn("Skipping deletion of non-project image:", imageUrl);
            return;
        }

        const urlParts = imageUrl.split(`${storageBucket}/`);
        if (urlParts.length < 2) {
            console.warn("Could not extract filename from URL:", imageUrl);
            return;
        }

        const fileName = urlParts[1]; // decoding might be needed if url encoded, but supabase usually handles standard names

        const { error } = await supabase.storage
            .from(storageBucket)
            .remove([fileName]);

        if (error) {
            console.error("Supabase deletion error:", error);
            // We might not want to throw here to avoid blocking the main deleting/updating flow
            // but logging is critical.
        } else {
            console.log("Successfully deleted image:", fileName);
        }

    } catch (error) {
        console.error("Error deleting image from Supabase:", error);
    }
};

/**
 * Transforms a Supabase Storage URL into a local Vercel proxy URL.
 * This triggers the Vercel rewrite rule defined in vercel.json, enabling
 * aggressive browser caching and offloading bandwidth from Supabase to Vercel.
 */
export const getProxiedImageUrl = (url: string) => {
    if (!url) return '';

    // In local development, Vercel rewrites don't work (unless using vercel dev), 
    // so we return the original URL to ensure images load.
    if (process.env.NODE_ENV === 'development') {
        return url;
    }

    // Check if the URL matches our Supabase storage project
    // URL found in src/lib/supabase.ts: https://qigrfrfvtlmvymuqodxw.supabase.co
    // Bucket: products
    const supabaseStorageBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storageBucket}`;

    // If it's a direct Supabase URL, create a proxied version
    if (url.startsWith(supabaseStorageBase)) {
        // Extract the path after the bucket name
        const path = url.replace(supabaseStorageBase, '');
        return `/cdn-images${path}`;
    }

    // Return original URL if it doesn't match criteria
    return url;
};

