import { NextRequest, NextResponse } from 'next/server';
import supabase, { getSupabase } from '@/utils/supabase';
import { CartItem } from '@/utils/types';

// Function to group items by seller
const groupItemsBySeller = (items: CartItem[]): Record<string, CartItem[]> => {
  const groupedItems: Record<string, CartItem[]> = {};
  
  items.forEach(item => {
    const sellerId = item.seller_id || 'official';
    if (!groupedItems[sellerId]) {
      groupedItems[sellerId] = [];
    }
    groupedItems[sellerId].push(item);
  });
  
  return groupedItems;
};

// Function to calculate subtotal for a group of items
const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export async function POST(request: NextRequest) {
  try {
    // Get data from the request
    const { 
      customer,
      items,
      paymentIntent,
      amount,
      shippingDetails
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
    
    // Group items by seller
    const groupedItems = groupItemsBySeller(items);
    
    // Prepare seller details for storage
    const sellerData = Object.keys(groupedItems).map(sellerId => {
      const sellerItems = groupedItems[sellerId];
      const subtotal = calculateSubtotal(sellerItems);
      const shippingOption = shippingDetails?.options?.[sellerId] || 'standard';
      
      // Calculate shipping cost based on option
      let shippingCost = 5.99; // base shipping
      if (shippingOption === 'express') {
        shippingCost += 4.99;
      } else if (shippingOption === 'priority') {
        shippingCost += 9.99;
      }
      
      return {
        seller_id: sellerId,
        item_count: sellerItems.length,
        subtotal: subtotal,
        shipping_option: shippingOption,
        shipping_cost: shippingCost,
        total: subtotal + shippingCost,
        items: sellerItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        }))
      };
    });
    
    // Create the main order in Supabase
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
        seller_details: sellerData, // Store seller-specific details
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
      seller_id: item.seller_id || 'official',
      listing_id: item.listing_id || null
    }));
    
    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Don't fail the whole request if this fails, just log it
    }
    
    // Create seller-specific order records for easier tracking
    if (sellerData.length > 1) {
      const sellerOrders = sellerData.map(sellerDetail => ({
        parent_order_id: order.id,
        seller_id: sellerDetail.seller_id,
        customer_name: customer.name,
        customer_email: customer.email,
        shipping_address: {
          address: customer.address,
          city: customer.city,
          postal_code: customer.postalCode,
          country: customer.country,
        },
        shipping_option: sellerDetail.shipping_option,
        shipping_cost: sellerDetail.shipping_cost,
        subtotal: sellerDetail.subtotal,
        amount: sellerDetail.total,
        currency: 'usd',
        status: 'pending',
        items: sellerDetail.items
      }));
      
      const { error: sellerOrdersError } = await supabaseClient
        .from('seller_orders')
        .insert(sellerOrders);
      
      if (sellerOrdersError) {
        console.error('Error creating seller orders:', sellerOrdersError);
        // Don't fail the whole request if this fails, just log it
      }
    }
    
    // Return the order
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        seller_count: Object.keys(groupedItems).length
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