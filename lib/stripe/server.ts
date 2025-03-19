import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia', // Use the latest stable API version
  appInfo: {
    name: 'The Shop Records',
    version: '0.1.0',
  },
});

export default stripe; 