import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe/server';
import { CartItem } from '@/utils/types';

interface ShippingDetails {
  options: Record<string, string>;
  totalShipping: number;
}

// Helper function to calculate the total amount
const calculateOrderAmount = (
  items: CartItem[], 
  shippingDetails?: ShippingDetails
): number => {
  // Calculate the subtotal from the cart items
  const subtotal = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Add shipping cost
  let shipping = 0;
  if (shippingDetails && shippingDetails.totalShipping) {
    shipping = shippingDetails.totalShipping;
  } else if (items.length > 0) {
    // Fallback to fixed shipping if details not provided
    shipping = 5.99;
  }
  
  // Calculate the total (can add tax calculation here if needed)
  const total = subtotal + shipping;
  
  // Return the amount in cents for Stripe
  return Math.round(total * 100);
};

export async function POST(request: NextRequest) {
  try {
    // Get cart items from the request body
    const { items, shippingDetails, customer } = await request.json();
    
    if (!items || !items.length) {
      return NextResponse.json(
        { error: { message: 'No items in cart' } },
        { status: 400 }
      );
    }

    // Calculate order amount
    const amount = calculateOrderAmount(items, shippingDetails);
    
    // Group items by seller for metadata
    const groupedItems: Record<string, CartItem[]> = {};
    items.forEach((item: CartItem) => {
      const sellerId = item.seller_id || 'official';
      if (!groupedItems[sellerId]) {
        groupedItems[sellerId] = [];
      }
      groupedItems[sellerId].push(item);
    });
    
    // Create seller metadata
    const sellerDetails = Object.keys(groupedItems).map(sellerId => {
      // Get the shipping option for this seller
      const shippingOption = shippingDetails?.options?.[sellerId] || 'standard';
      
      // Calculate subtotal for this seller
      const subtotal = groupedItems[sellerId].reduce(
        (total, item) => total + (item.price * item.quantity), 
        0
      );
      
      return {
        id: sellerId,
        items: groupedItems[sellerId].length,
        subtotal,
        shipping_option: shippingOption
      };
    });
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      // You can store customer information as metadata if needed
      metadata: {
        customer_name: customer?.name || '',
        customer_email: customer?.email || '',
        total_shipping: String(shippingDetails?.totalShipping || 5.99),
        sellers: JSON.stringify(sellerDetails),
        order_items: JSON.stringify(items.map((item: CartItem) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          seller_id: item.seller_id || 'official'
        })))
      },
    });

    // Return the client secret to the client
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    
    return NextResponse.json(
      { error: { message: error.message || 'An error occurred while creating the payment intent' } },
      { status: 500 }
    );
  }
} 