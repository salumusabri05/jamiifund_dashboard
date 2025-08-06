import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Regular client with anonymous key for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role for admin operations
// This should only be used in secure server-side contexts
export const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

export default supabase;