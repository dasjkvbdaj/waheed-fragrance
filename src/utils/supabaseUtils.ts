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
