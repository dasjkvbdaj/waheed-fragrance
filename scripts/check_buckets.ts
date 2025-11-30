
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qigrfrfvtlmvymuqodxw.supabase.co";
const supabaseKey = "sb_publishable_I7TdO-PQe6riDqb6GDgXwQ_5aOeiBmF";

const supabase = createClient(supabaseUrl, supabaseKey);

async function listBuckets() {
    console.log('Attempting to list buckets...');
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('Error listing buckets:', error);
    } else {
        console.log('Buckets:', data);
    }
}

listBuckets();
