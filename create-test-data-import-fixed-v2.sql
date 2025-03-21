-- SQL script to create test marketplace data (FIXED VERSION - WITH USER CHECK)
-- Run this in the Supabase SQL Editor directly

DO $$
DECLARE
  -- We'll get a real user ID from the users table
  test_seller_id UUID;
  test_listing_id_1 UUID := '550e8400-e29b-41d4-a716-446655440001';
  test_listing_id_2 UUID := '550e8400-e29b-41d4-a716-446655440002';
  test_listing_id_3 UUID := '550e8400-e29b-41d4-a716-446655440003';
  
  -- Get some random product IDs
  product_id_1 UUID;
  product_id_2 UUID;
  product_id_3 UUID;
  
  product_title_1 TEXT;
  product_title_2 TEXT;
  product_title_3 TEXT;
  
  -- Use hardcoded price values since products table doesn't have a price column
  product_price_1 DECIMAL := 29.99;
  product_price_2 DECIMAL := 24.99;
  product_price_3 DECIMAL := 19.99;
  
  -- Variable to check if we have any users
  user_exists BOOLEAN;
BEGIN
  -- First check if we have any users
  SELECT EXISTS (
    SELECT 1 
    FROM users 
    LIMIT 1
  ) INTO user_exists;
  
  IF NOT user_exists THEN
    RAISE EXCEPTION 'No users found in the database! Please create at least one user first.';
  END IF;
  
  -- Get a user ID
  SELECT id INTO test_seller_id FROM users LIMIT 1;
  RAISE NOTICE 'Using existing user ID: %', test_seller_id;
  
  -- Get random products from the database - just id and title
  SELECT id, title INTO product_id_1, product_title_1
  FROM products
  ORDER BY RANDOM()
  LIMIT 1;
  
  SELECT id, title INTO product_id_2, product_title_2
  FROM products
  WHERE id <> product_id_1
  ORDER BY RANDOM()
  LIMIT 1;
  
  SELECT id, title INTO product_id_3, product_title_3
  FROM products
  WHERE id <> product_id_1 AND id <> product_id_2
  ORDER BY RANDOM()
  LIMIT 1;
  
  -- Check if we found products
  IF product_id_1 IS NULL OR product_id_2 IS NULL OR product_id_3 IS NULL THEN
    RAISE EXCEPTION 'Could not find enough products in the database';
  END IF;

  -- Insert test seller profile
  INSERT INTO seller_profiles (
    user_id,
    store_name,
    description,
    contact_email,
    is_verified,
    average_rating,
    created_at,
    updated_at
  ) VALUES (
    test_seller_id,
    'Test Record Shop',
    'A test seller account for marketplace testing created via SQL import',
    'test-import@example.com',
    TRUE,
    4.9,
    NOW(),
    NOW()
  ) ON CONFLICT (user_id) DO UPDATE
  SET 
    store_name = EXCLUDED.store_name,
    description = EXCLUDED.description,
    updated_at = NOW();

  -- Create test listings for the products
  -- Listing 1
  INSERT INTO listings (
    id,
    seller_id,
    product_id,
    title,
    description,
    price,
    condition,
    quantity,
    status,
    media_condition,
    sleeve_condition,
    created_at,
    updated_at
  ) VALUES (
    test_listing_id_1,
    test_seller_id,
    product_id_1,
    product_title_1 || ' (Test Listing)',
    'Test listing for ' || product_title_1 || '. This is in mint condition.',
    product_price_1 * 0.9, -- 10% discount
    'new',
    2,
    'active',
    'new',
    'new',
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE
  SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    updated_at = NOW();

  -- Listing 2
  INSERT INTO listings (
    id,
    seller_id,
    product_id,
    title,
    description,
    price,
    condition,
    quantity,
    status,
    media_condition,
    sleeve_condition,
    created_at,
    updated_at
  ) VALUES (
    test_listing_id_2,
    test_seller_id,
    product_id_2,
    product_title_2 || ' (Test Listing)',
    'Test listing for ' || product_title_2 || '. This is in very good condition.',
    product_price_2 * 0.8, -- 20% discount
    'very_good',
    1,
    'active',
    'very_good',
    'good',
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE
  SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    updated_at = NOW();

  -- Listing 3
  INSERT INTO listings (
    id,
    seller_id,
    product_id,
    title,
    description,
    price,
    condition,
    quantity,
    status,
    media_condition,
    sleeve_condition,
    created_at,
    updated_at
  ) VALUES (
    test_listing_id_3,
    test_seller_id,
    product_id_3,
    product_title_3 || ' (Test Listing)',
    'Test listing for ' || product_title_3 || '. This is in good condition.',
    product_price_3 * 0.75, -- 25% discount
    'good',
    3,
    'active',
    'good',
    'acceptable',
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE
  SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    updated_at = NOW();
  
  -- Add test listing images
  INSERT INTO listing_images (
    listing_id,
    url,
    position,
    is_primary
  ) VALUES 
  (test_listing_id_1, 'https://example.com/test-image-1.jpg', 1, TRUE),
  (test_listing_id_2, 'https://example.com/test-image-2.jpg', 1, TRUE),
  (test_listing_id_3, 'https://example.com/test-image-3.jpg', 1, TRUE)
  ON CONFLICT DO NOTHING;
  
  -- Output success message
  RAISE NOTICE 'Test data created successfully with Seller ID: %', test_seller_id;
  RAISE NOTICE 'Created listings with IDs: %, %, %', test_listing_id_1, test_listing_id_2, test_listing_id_3;
END $$; 