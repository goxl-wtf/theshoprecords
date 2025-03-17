import { createClient } from '@supabase/supabase-js';

// Default to empty strings to prevent build errors, but check in browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only initialize if URL and key are available
const supabase = 
  supabaseUrl && supabaseKey 
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// Custom function to get the client with safety checks
export function getSupabase() {
  if (!supabase) {
    if (typeof window !== 'undefined') {
      console.error('Supabase client not initialized. Check your environment variables.');
    }
    return null;
  }
  return supabase;
}

export default supabase; 