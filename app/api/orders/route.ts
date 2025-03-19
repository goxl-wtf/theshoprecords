import { NextRequest, NextResponse } from 'next/server';
import supabase, { getSupabase } from '@/utils/supabase';
import { CartItem } from '@/utils/types';

export async function POST(request: NextRequest) {
  try {
    // Get data from the request
    const { 
      customer,
      items,
      paymentIntent,
      amount
    } = await request.json();
    
    // Validate the data
    if (!customer || !items || !items.length || !paymentIntent || !amount) {
      return NextResponse.json(
        { error: { message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Get Supabase client
    const supabaseClient = getSupabase();
    
    if (!supabaseClient) {
      return NextResponse.json(
        { error: { message: 'Database connection failed' } },
        { status: 500 }
      );
    }
    
    // Create the order in Supabase
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        shipping_address: {
          address: customer.address,
          city: customer.city,
          postal_code: customer.postalCode,
          country: customer.country,
        },
        order_items: items, // Store the entire items array as JSON
        payment_intent_id: paymentIntent.id,
        payment_status: paymentIntent.status,
        amount: amount,
        currency: 'usd',
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: { message: 'Failed to create order' } },
        { status: 500 }
      );
    }
    
    // Now add individual items to order_items table (for better querying)
    const orderItems = items.map((item: CartItem) => ({
      order_id: order.id,
      product_id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));
    
    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Don't fail the whole request if this fails, just log it
    }
    
    // Return the order
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
      }
    });
    
  } catch (error: any) {
    console.error('Error processing order:', error);
    
    return NextResponse.json(
      { error: { message: error.message || 'An error occurred while processing the order' } },
      { status: 500 }
    );
  }
} 