import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

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

/**
 * Creates a server-side Supabase client with proper cookie handling for Next.js 15+
 * This should be used in API routes and server components
 */
export async function createServerSupabaseClient() {
  try {
    // Import dynamically to avoid SSR issues
    const { cookies } = await import('next/headers');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL or key is missing. Check your environment variables.');
      return null;
    }
    
    // Create server client with properly awaited cookies
    return createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          // Important: We need to define these as async functions and await cookies()
          async get(name) {
            const cookieStore = await cookies();
            return cookieStore.get(name)?.value;
          },
          async set(name, value, options) {
            try {
              const cookieStore = await cookies();
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              console.error('Error setting cookie:', error);
            }
          },
          async remove(name, options) {
            try {
              const cookieStore = await cookies();
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              console.error('Error removing cookie:', error);
            }
          },
        },
      }
    );
  } catch (error) {
    console.error('Error creating server Supabase client:', error);
    return null;
  }
}

export default supabase; 