# Marketplace Testing and Optimization

This document outlines the testing plan and optimization techniques for the marketplace functionality in TheShopRecords application.

## Testing Overview

The marketplace functionality allows third-party sellers to list products alongside the official store. This requires comprehensive testing of:

1. Seller profiles and listing management
2. Product display with multiple seller options
3. Multi-seller cart operations
4. Checkout with items from multiple sellers
5. Performance optimization for marketplace data

## Database Schema Requirements

To support the marketplace functionality, the database requires the following tables:

- `seller_profiles`: Stores information about third-party sellers
- `listings`: Connects sellers to products with pricing and condition info
- `listing_images`: Stores images specific to listings (vs. product images)
- `seller_orders`: Stores order information specific to each seller

## Testing Results

During testing, we identified several issues:

1. **Database Schema Issues:**
   - `listing_images` table is missing entirely
   - `seller_orders` table is missing entirely
   - `seller_profiles` table exists but is missing required columns like `store_name`
   - Relationship between tables needs fixing

2. **Application Errors:**
   - Browser console shows NaN errors for min, max, and value attributes (price range slider)
   - API errors when trying to fetch listing relationships
   - Specific error: "column users_1.store_name does not exist" when querying seller information

3. **Component Testing Results:**
   - The ProductListings component works correctly with mock data:
     - Sorting by price (both ascending and descending) functions properly
     - Sorting by seller rating works correctly
     - Verified seller filtering shows only verified sellers
     - Condition formatting and filtering works as expected

## Detailed Database Schema Fixes

Based on our testing, the following database issues need to be fixed:

1. `listing_images` table is missing entirely
2. `seller_orders` table is missing entirely
3. `seller_profiles` table exists but is missing required columns like `store_name`
4. The relationship between tables is not properly set up

### Step-by-Step Fix Instructions

1. Login to your Supabase dashboard
2. Navigate to the SQL Editor
3. Create a new query and paste the contents of the `marketplace-schema-fix.sql` file
4. Execute the SQL script
5. Verify the schema was fixed by running the `check-marketplace-schema.js` script

Once the schema is fixed, you should see output indicating all required tables are present and the relationships are working properly.

## Temporary Code Fixes

While waiting for the database schema to be fixed, we've made the following temporary code changes:

1. Updated `marketplaceService.ts` to avoid using the missing `store_name` column
2. Added validation to the `PriceRangeSlider` component to handle NaN values
3. Added defensive code in API calls to handle database errors gracefully

After running the schema fixes, these temporary changes will still work but can be removed once the proper schema is in place.

## Testing After Schema Fixes

### 1. Basic Database Operations

Run the following script to verify the database schema is fixed:

```bash
node check-marketplace-schema.js
```

If successful, you should see all required tables exist and the relationships are working properly.

### 2. Test Seller Profile Creation

Run the following script to create a test seller profile:

```bash
node test-product-listings.js
```

This will attempt to create a test listing for a product. If the schema is fixed, it should complete successfully.

### 3. UI Testing

Start the development server:

```bash
npm run dev
```

Visit the following pages to test the marketplace functionality:

- `/shop` - Verify product cards show seller information
- `/shop/[id]` - Check the product detail page shows listings from different sellers
- Add a product to cart from the marketplace and verify it works
- Complete the checkout process to verify seller orders are created properly

Use browser tools to check for errors:

```javascript
// Check for console errors
console.errors

// Check for network errors
fetch errors
```

## Performance Optimization

After verifying the marketplace functionality works correctly, implement the following optimizations:

1. **Add Database Indexes**

```sql
-- Add index for product_id on listings table
CREATE INDEX IF NOT EXISTS idx_listings_product_id ON listings(product_id);

-- Add index for status on listings table
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);

-- Add index for condition on listings table
CREATE INDEX IF NOT EXISTS idx_listings_condition ON listings(condition);

-- Add index for price on listings table
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
```

2. **Implement Server-Side Pagination**

Update the `fetchActiveListings` function in `marketplaceService.ts` to use server-side pagination:

```typescript
export const fetchActiveListings = async (
  page = 1,
  pageSize = 12,
  // ... other parameters
): Promise<{ listings: Listing[]; totalCount: number; pageCount: number }> => {
  // ... existing code ...
  
  // Calculate pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Apply range to query
  query = query.range(from, to);
  
  // ... rest of function ...
  
  // Return pagination info
  return {
    listings: data as Listing[],
    totalCount: count || 0,
    pageCount: Math.ceil((count || 0) / pageSize)
  };
};
```

3. **Add Caching**

Implement caching for frequently accessed marketplace data:

```typescript
// Cache for marketplace listings (example)
const CACHE_TTL = 60 * 5; // 5 minutes
const listingsCache = new Map();

export const fetchListingsByProduct = async (productId: string): Promise<Listing[]> => {
  // Check cache first
  const cacheKey = `listings_${productId}`;
  const cachedData = listingsCache.get(cacheKey);
  
  if (cachedData && cachedData.timestamp > Date.now() - CACHE_TTL * 1000) {
    return cachedData.data;
  }
  
  // Fetch from database if not in cache
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    // ... existing database query ...
    
    // Store in cache
    listingsCache.set(cacheKey, {
      data: listings,
      timestamp: Date.now()
    });
    
    return listings;
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
};
```

## Troubleshooting Common Issues

### 1. "Column users_1.store_name does not exist"

This error occurs when trying to join the seller_profiles table when it doesn't have the required columns. Fix it by running the schema fix SQL script.

### 2. NaN Errors in Price Range Slider

These errors occur when the price range values are not properly validated. The fix is already in place in the PriceRangeSlider component.

### 3. API Failures with Listing Images

The listing_images table is missing. Fix it by running the schema fix SQL script. Until then, avoid using the listing_images relationship in queries.

### 4. Empty Product Listings

If no listings appear for products, verify the test data was created successfully and check the database for listings. 