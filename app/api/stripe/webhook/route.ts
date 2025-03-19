import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe/server';
import supabase, { getSupabase } from '@/utils/supabase';

// This webhook handles events from Stripe, typically payment confirmations and failures
export async function POST(request: NextRequest) {
  const body = await request.text();
  // Get Stripe signature from headers directly
  const signature = request.headers.get('stripe-signature');
  
  // Get the Stripe webhook secret from environment variables
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('Missing Stripe webhook secret');
    return NextResponse.json(
      { error: { message: 'Webhook secret is not configured' } },
      { status: 500 }
    );
  }
  
  let event;
  
  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(body, signature as string, webhookSecret);
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: { message: 'Webhook signature verification failed' } },
      { status: 400 }
    );
  }
  
  // Get the Supabase client
  const supabaseClient = getSupabase();
  
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return NextResponse.json(
      { error: { message: 'Database connection failed' } },
      { status: 500 }
    );
  }
  
  // Handle specific events
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`💰 PaymentIntent successful: ${paymentIntent.id}`);
        
        // Update order in database
        const { error: updateError } = await supabaseClient
          .from('orders')
          .update({
            payment_status: 'succeeded',
            status: 'completed',
          })
          .eq('payment_intent_id', paymentIntent.id);
        
        if (updateError) {
          console.error('Error updating order:', updateError);
        }
        
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        const error = failedPaymentIntent.last_payment_error;
        console.log(`❌ Payment failed: ${failedPaymentIntent.id}, ${error ? error.message : ''}`);
        
        // Update order in database
        const { error: failedUpdateError } = await supabaseClient
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'failed',
          })
          .eq('payment_intent_id', failedPaymentIntent.id);
        
        if (failedUpdateError) {
          console.error('Error updating failed order:', failedUpdateError);
        }
        
        break;
        
      case 'charge.refunded':
        const charge = event.data.object;
        console.log(`⏪ Charge refunded: ${charge.id}`);
        
        // Update order in database (using the PaymentIntent ID stored in charge metadata)
        if (charge.payment_intent) {
          const { error: refundUpdateError } = await supabaseClient
            .from('orders')
            .update({
              payment_status: 'refunded',
              status: 'refunded',
            })
            .eq('payment_intent_id', charge.payment_intent);
          
          if (refundUpdateError) {
            console.error('Error updating refunded order:', refundUpdateError);
          }
        }
        
        break;
        
      default:
        // Unhandled event type
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
    
  } catch (err) {
    console.error(`Error handling Stripe event: ${err}`);
    return NextResponse.json(
      { error: { message: 'Error handling webhook event' } },
      { status: 500 }
    );
  }
} 