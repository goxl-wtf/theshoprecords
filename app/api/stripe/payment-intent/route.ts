import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe/server';
import { CartItem } from '@/utils/types';

// Helper function to calculate the total amount
const calculateOrderAmount = (items: CartItem[]): number => {
  // Calculate the subtotal from the cart items
  const subtotal = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Add shipping cost (fixed for now)
  const shipping = items.length > 0 ? 5.99 : 0;
  
  // Calculate the total (can add tax calculation here if needed)
  const total = subtotal + shipping;
  
  // Return the amount in cents for Stripe
  return Math.round(total * 100);
};

export async function POST(request: NextRequest) {
  try {
    // Get cart items from the request body
    const { items, customer } = await request.json();
    
    if (!items || !items.length) {
      return NextResponse.json(
        { error: { message: 'No items in cart' } },
        { status: 400 }
      );
    }

    // Calculate order amount
    const amount = calculateOrderAmount(items);
    
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
        order_items: JSON.stringify(items.map((item: CartItem) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price
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