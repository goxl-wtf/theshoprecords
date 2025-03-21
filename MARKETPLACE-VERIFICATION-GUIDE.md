# Marketplace Functionality Verification Guide

## Overview

This guide provides a step-by-step approach to test and verify the marketplace functionality in The Shop Records application. It addresses the Row-Level Security (RLS) issues and database schema problems identified during testing.

## Prerequisites

1. Node.js installed
2. Access to the Supabase project
3. `.env.local` file with Supabase credentials
4. Optional: Supabase service role key for bypassing RLS

## Step 1: Verify Database Schema

First, let's check the current state of the database schema:

```bash
node check-marketplace-schema.js
```

This will show:
- If all required tables exist
- Row counts for each table
- Column structure of each table
- Any join relationship issues

## Step 2: Fix Database Schema Issues

### Option A: Using the SQL Editor (Recommended)

1. Log in to the Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `fix-bypass-rls.sql`
4. Run the script to:
   - Create SECURITY DEFINER functions to bypass RLS
   - Fix foreign key relationships
   - Ensure test data is accessible

### Option B: Using Direct Scripts

If you have the `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local` file:

```bash
node create-direct-test-data.js
```

This will create test data directly using the REST API to bypass RLS policies.

## Step 3: Verify User Setup

Check that users are properly set up and the `is_seller` flag is set:

```bash
node check-users-table.js
```

If you need to link a specific user to a seller profile:

```bash
node link-auth-user-to-seller.js user@example.com "Store Name"
```

## Step 4: Final Database Verification

Run the final verification script to confirm that:
- Listings exist and are accessible
- Product relationships are correctly established
- Seller information can be accessed (even with RLS restrictions)

```bash
node final-fix-marketplace.js
```

## Step 5: Test the Application

Start the development server:

```bash
npm run dev
```

### Test Pages

1. **Shop Page**
   - Navigate to `/shop`
   - Verify that product listings show seller information
   - Check that filters and sorting work correctly

2. **Product Detail Page**
   - Navigate to a specific product (e.g., `/shop/[product-id]`)
   - Verify that all listings for the product are shown
   - Check that seller information is displayed for each listing

3. **Cart Page**
   - Add items from different sellers to your cart
   - Verify that items are grouped by seller
   - Check that seller information is displayed in the cart

4. **Checkout Page**
   - Proceed to checkout with items from multiple sellers
   - Verify that shipping options are available per seller
   - Complete a test order to ensure seller orders are created

## Troubleshooting

### Issue: "Cannot access seller_profiles due to RLS"

This is expected due to the Row-Level Security policies. Our implementation has two workarounds:

1. **Fallback Mechanism**:
   The `marketplaceService.ts` file includes a fallback that creates a minimal seller profile when direct access is blocked.

2. **SECURITY DEFINER Functions**:
   The `fix-bypass-rls.sql` script creates functions with elevated privileges to access seller profiles securely.

### Issue: Missing Foreign Key Relationship

If joins between `listings` and `seller_profiles` fail, ensure:

1. The foreign key is properly defined in `fix-bypass-rls.sql`
2. The manual join fallback is working correctly

### Issue: User Registration Problems

If you encounter issues with the authentication flow:

1. Check that the `app/auth/register/page.tsx` file exists
2. Verify that the `UserContext` and `SellerContext` are working correctly
3. Use the `link-auth-user-to-seller.js` script to manually link users to seller profiles

## Verification Checklist

- [ ] All required tables exist
- [ ] Test listings are created and accessible
- [ ] Seller profiles are accessible (directly or via fallback)
- [ ] Foreign key relationship between `listings.seller_id` and `seller_profiles.user_id` is established
- [ ] Shop page displays products with seller information
- [ ] Product detail page shows listings from different sellers
- [ ] Cart functions correctly with items from multiple sellers
- [ ] Checkout process works with multiple sellers 