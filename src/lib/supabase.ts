import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "https://qigrfrfvtlmvymuqodxw.supabase.co";
const supabaseKey = "sb_publishable_I7TdO-PQe6riDqb6GDgXwQ_5aOeiBmF";

export const supabase = createClient(supabaseUrl, supabaseKey);
export const storageBucket = "products";
