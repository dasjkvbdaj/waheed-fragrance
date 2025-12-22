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
 * @param imageUrl The full public URL of the image to delete.
 */
export const deleteImageFromSupabase = async (imageUrl: string): Promise<void> => {
    if (!imageUrl) return;

    try {
        // Extract the file path from the URL
        // Example: https://.../storage/v1/object/public/{bucketName}/{fileName}
        const urlObj = new URL(imageUrl);
        const pathParts = urlObj.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];

        if (!fileName) {
            console.warn("Could not extract filename from URL:", imageUrl);
            return;
        }

        const { error } = await supabase.storage
            .from(storageBucket)
            .remove([fileName]);

        if (error) {
            console.error("Supabase delete error:", error);
        } else {
            console.log("Deleted old image from Supabase:", fileName);
        }
    } catch (error) {
        console.error("Error deleting image from Supabase:", error);
    }
};
