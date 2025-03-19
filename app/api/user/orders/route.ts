import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/utils/supabase';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * GET endpoint to fetch the current user's order history
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from Supabase Auth
    const supabaseAuth = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get database client
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Fetch orders for the current user
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
          product:products(id, title, slug, images(url))
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ orders });
    
  } catch (error) {
    console.error('Unexpected error in orders API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 