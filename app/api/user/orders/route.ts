import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, createServerSupabaseClient } from '@/utils/supabase';

/**
 * GET endpoint to fetch the current user's order history
 */
export async function GET(request: NextRequest) {
  try {
    console.log('Orders API: Processing request');
    
    // Get authenticated user from Supabase Auth with proper async cookie handling
    const supabaseServer = await createServerSupabaseClient();
    if (!supabaseServer) {
      console.error('Orders API: Failed to initialize Supabase client');
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 500 }
      );
    }
    
    console.log('Orders API: Created Supabase server client');
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (authError) {
      console.error('Orders API: Auth error:', authError);
      return NextResponse.json(
        { error: 'Authentication error', details: authError.message },
        { status: 401 }
      );
    }
    
    if (!user) {
      console.log('Orders API: No authenticated user found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log('Orders API: Authenticated user:', user.id);
    
    // Get database client
    const supabase = getSupabase();
    if (!supabase) {
      console.error('Orders API: Failed to initialize database client');
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    console.log('Orders API: Database client initialized');
    
    // Fetch orders for the current user
    console.log('Orders API: Fetching orders for user:', user.id);
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id, 
        created_at, 
        total, 
        status, 
        payment_status, 
        shipping_address,
        shipping_method,
        contact_email,
        order_items:order_items(
          id,
          product_id,
          quantity,
          price,
          product:products(id, title, artist, images(url))
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (ordersError) {
      console.error('Orders API: Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch orders', details: ordersError.message },
        { status: 500 }
      );
    }
    
    console.log(`Orders API: Successfully fetched ${orders?.length || 0} orders`);
    
    return NextResponse.json({ orders });
    
  } catch (error) {
    console.error('Orders API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 