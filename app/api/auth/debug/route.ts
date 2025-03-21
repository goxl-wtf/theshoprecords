import { NextResponse } from 'next/server';
import { getSupabase } from '@/utils/supabaseClient';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET() {
  try {
    // Initialize both auth client and regular client with proper async cookie handling
    const cookieStore = await cookies();
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    const supabase = getSupabase();
    
    if (!supabase) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase client not initialized',
        env: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'not set',
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'not set',
        }
      });
    }

    // Check user session with auth client
    const { data: authData, error: authError } = await supabaseServer.auth.getUser();
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    // Get DB users for comparison
    const { data: dbUsers, error: dbError } = await supabase
      .from('users')
      .select('*');
    
    return NextResponse.json({
      status: 'success',
      message: 'Auth debug information',
      authUser: authData?.user || null,
      authError: authError?.message || null,
      session: sessionData,
      sessionError: sessionError?.message || null,
      usersInDB: dbUsers?.length || 0,
      dbError: dbError?.message || null,
      dbUsers: dbUsers?.map(user => ({
        id: user.id,
        email: user.email,
        username: user.username,
        auth_id: user.auth_id,
        has_seller_profile: !!user.seller_profile
      })) || []
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error in auth debug endpoint',
      error: error instanceof Error ? error.message : String(error)
    });
  }
} 