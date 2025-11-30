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
