import { CartItem } from './types';

/**
 * Groups cart items by seller for multi-seller checkout
 */
export interface SellerGroup {
  seller_id: string;
  seller_name: string;
  items: CartItem[];
  subtotal: number;
}

/**
 * Groups cart items by seller
 * Used for displaying items by seller in checkout and creating separate payment intents
 */
export function groupItemsBySeller(cartItems: CartItem[]): SellerGroup[] {
  // First, group the items by seller
  const sellerGroups: { [key: string]: SellerGroup } = {};
  
  cartItems.forEach((item) => {
    // Use a default seller ID if none provided (for backward compatibility)
    const sellerId = item.seller_id || 'default';
    const sellerName = item.seller_name || 'TheShopRecords Official';
    
    // Initialize the seller group if it doesn't exist
    if (!sellerGroups[sellerId]) {
      sellerGroups[sellerId] = {
        seller_id: sellerId,
        seller_name: sellerName,
        items: [],
        subtotal: 0
      };
    }
    
    // Add the item to the seller group
    sellerGroups[sellerId].items.push(item);
    sellerGroups[sellerId].subtotal += item.totalPrice;
  });
  
  // Convert the object to an array for easier rendering
  return Object.values(sellerGroups);
}

/**
 * Calculates shipping costs for each seller group
 * In a real-world scenario, this would likely be more complex, considering:
 * - Shipping zones
 * - Package weight
 * - Seller-specific shipping policies
 */
export function calculateShippingCost(sellerGroup: SellerGroup): number {
  // Example simplified shipping logic
  // Base shipping fee per seller
  const baseShippingFee = 5.99;
  
  // Additional fee based on number of items (simulating weight)
  const itemCount = sellerGroup.items.length;
  const additionalFee = Math.min(itemCount - 1, 5) * 1.50; // Cap at 5 additional items
  
  return baseShippingFee + additionalFee;
}

/**
 * Calculates total shipping cost for all seller groups
 */
export function calculateTotalShippingCost(sellerGroups: SellerGroup[]): number {
  return sellerGroups.reduce((total, group) => total + calculateShippingCost(group), 0);
}

/**
 * Calculates tax for the order
 * In a real-world scenario, this would be based on location, tax rules, etc.
 */
export function calculateTax(subtotal: number, shippingCost: number = 0): number {
  // Example tax rate of 8%
  const taxRate = 0.08;
  return (subtotal + shippingCost) * taxRate;
}

/**
 * Calculates the order total including shipping and tax
 */
export function calculateOrderTotal(
  sellerGroups: SellerGroup[],
  includeShipping: boolean = true,
  includeTax: boolean = true
): number {
  const subtotal = sellerGroups.reduce((total, group) => total + group.subtotal, 0);
  const shipping = includeShipping ? calculateTotalShippingCost(sellerGroups) : 0;
  const tax = includeTax ? calculateTax(subtotal, shipping) : 0;
  
  return subtotal + shipping + tax;
}

/**
 * Formats the checkout items for each payment intent
 * Used when creating separate payment intents for each seller
 */
export function formatPaymentIntentItems(sellerGroups: SellerGroup[]): {
  seller_id: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items: CartItem[];
}[] {
  return sellerGroups.map(group => {
    const shipping = calculateShippingCost(group);
    const tax = calculateTax(group.subtotal, shipping);
    
    return {
      seller_id: group.seller_id,
      subtotal: group.subtotal,
      shipping,
      tax,
      total: group.subtotal + shipping + tax,
      items: group.items
    };
  });
} 