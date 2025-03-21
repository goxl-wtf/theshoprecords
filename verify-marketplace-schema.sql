-- MARKETPLACE SCHEMA VERIFICATION SCRIPT
-- Run this script in Supabase SQL Editor to verify if the schema fixes were applied correctly

-- 1. Check if required tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN 'OK' 
    ELSE 'MISSING' 
  END AS status
FROM (
  SELECT 'seller_profiles' AS expected_table
  UNION SELECT 'listings'
  UNION SELECT 'listing_images'
  UNION SELECT 'seller_orders'
) AS expected
LEFT JOIN information_schema.tables t ON 
  t.table_name = expected.expected_table AND
  t.table_schema = 'public';

-- 2. Check if seller_profiles table has all required columns
SELECT 
  expected_column,
  actual_column,
  CASE 
    WHEN actual_column IS NOT NULL THEN 'OK' 
    ELSE 'MISSING' 
  END AS status
FROM (
  SELECT 'store_name' AS expected_column
  UNION SELECT 'description'
  UNION SELECT 'logo_url'
  UNION SELECT 'contact_email'
  UNION SELECT 'payment_details'
  UNION SELECT 'is_verified'
  UNION SELECT 'created_at'
  UNION SELECT 'updated_at'
  UNION SELECT 'average_rating'
) AS expected
LEFT JOIN (
  SELECT column_name AS actual_column
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'seller_profiles'
) AS actual ON expected.expected_column = actual.actual_column;

-- 3. Check if listings table has all required columns
SELECT 
  expected_column,
  actual_column,
  CASE 
    WHEN actual_column IS NOT NULL THEN 'OK' 
    ELSE 'MISSING' 
  END AS status
FROM (
  SELECT 'id' AS expected_column
  UNION SELECT 'seller_id'
  UNION SELECT 'product_id'
  UNION SELECT 'title'
  UNION SELECT 'description'
  UNION SELECT 'price'
  UNION SELECT 'condition'
  UNION SELECT 'quantity'
  UNION SELECT 'status'
) AS expected
LEFT JOIN (
  SELECT column_name AS actual_column
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'listings'
) AS actual ON expected.expected_column = actual.actual_column;

-- 4. Check if listing_images table has all required columns
SELECT 
  expected_column,
  actual_column,
  CASE 
    WHEN actual_column IS NOT NULL THEN 'OK' 
    ELSE 'MISSING' 
  END AS status
FROM (
  SELECT 'id' AS expected_column
  UNION SELECT 'listing_id'
  UNION SELECT 'url'
  UNION SELECT 'position'
  UNION SELECT 'is_primary'
  UNION SELECT 'created_at'
) AS expected
LEFT JOIN (
  SELECT column_name AS actual_column
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'listing_images'
) AS actual ON expected.expected_column = actual.actual_column;

-- 5. Check if seller_orders table has all required columns
SELECT 
  expected_column,
  actual_column,
  CASE 
    WHEN actual_column IS NOT NULL THEN 'OK' 
    ELSE 'MISSING' 
  END AS status
FROM (
  SELECT 'id' AS expected_column
  UNION SELECT 'parent_order_id'
  UNION SELECT 'seller_id'
  UNION SELECT 'customer_name'
  UNION SELECT 'customer_email'
  UNION SELECT 'shipping_address'
  UNION SELECT 'shipping_option'
  UNION SELECT 'shipping_cost'
  UNION SELECT 'subtotal'
  UNION SELECT 'amount'
  UNION SELECT 'currency'
  UNION SELECT 'status'
  UNION SELECT 'items'
  UNION SELECT 'created_at'
  UNION SELECT 'updated_at'
) AS expected
LEFT JOIN (
  SELECT column_name AS actual_column
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'seller_orders'
) AS actual ON expected.expected_column = actual.actual_column;

-- 6. Check if all required indexes exist
SELECT 
  expected_index,
  actual_index,
  CASE 
    WHEN actual_index IS NOT NULL THEN 'OK' 
    ELSE 'MISSING' 
  END AS status
FROM (
  SELECT 'idx_listing_images_listing_id' AS expected_index
  UNION SELECT 'idx_seller_orders_parent_order_id'
  UNION SELECT 'idx_seller_orders_seller_id'
  UNION SELECT 'idx_listings_product_id'
  UNION SELECT 'idx_listings_status'
  UNION SELECT 'idx_listings_condition'
  UNION SELECT 'idx_listings_price'
  UNION SELECT 'idx_listings_status_condition'
  UNION SELECT 'idx_listings_product_status' 
  UNION SELECT 'idx_seller_profiles_is_verified'
  UNION SELECT 'idx_seller_profiles_rating'
) AS expected
LEFT JOIN (
  SELECT indexname AS actual_index
  FROM pg_indexes
  WHERE schemaname = 'public'
) AS actual ON expected.expected_index = actual.actual_index;

-- 7. Check if test data was created
SELECT 
  'Seller Profiles' AS table_name, 
  COUNT(*) AS row_count 
FROM seller_profiles
UNION
SELECT 
  'Listings' AS table_name, 
  COUNT(*) AS row_count 
FROM listings
UNION
SELECT 
  'Listing Images' AS table_name, 
  COUNT(*) AS row_count 
FROM listing_images
UNION
SELECT 
  'Seller Orders' AS table_name, 
  COUNT(*) AS row_count 
FROM seller_orders; 