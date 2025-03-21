-- SQL script to create test users and seller profiles
-- Run this directly in the Supabase SQL Editor to bypass RLS policies

-- Create test users
INSERT INTO users (
  id, 
  email,
  username,
  auth_id, 
  created_at
) VALUES 
(
  '790a3973-6bca-4092-ba7f-e2a370da42cf', 
  'seller@test.nl',
  'testseller',
  '790a3973-6bca-4092-ba7f-e2a370da42cf', -- Using the same ID as auth_id
  NOW()
),
(
  'f056e61f-5cdc-469f-9adb-a006532542bd', 
  'user@test.nl',
  'testuser',
  'f056e61f-5cdc-469f-9adb-a006532542bd', -- Using the same ID as auth_id
  NOW()
)
ON CONFLICT (id) DO 
UPDATE SET 
  email = EXCLUDED.email,
  username = EXCLUDED.username;

-- Create seller profile for the seller user
INSERT INTO seller_profiles (
  user_id,
  store_name,
  description,
  is_verified,
  average_rating,
  contact_email,
  created_at,
  updated_at
) VALUES (
  '790a3973-6bca-4092-ba7f-e2a370da42cf',
  'Test Record Shop',
  'A test seller account for marketplace testing',
  TRUE,
  4.9,
  'seller@test.nl',
  NOW(),
  NOW()
)
ON CONFLICT (user_id) DO
UPDATE SET
  store_name = EXCLUDED.store_name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Create test listings for existing products
-- First, identify 3 random products
WITH random_products AS (
  SELECT id, title
  FROM products
  ORDER BY RANDOM()
  LIMIT 3
)
-- Then insert a listing for each product
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
)
SELECT
  gen_random_uuid(), -- Generate a random UUID for each listing
  '790a3973-6bca-4092-ba7f-e2a370da42cf', -- Seller ID
  p.id, -- Product ID from the random selection
  p.title || ' (Test Listing)', -- Title based on product
  'Test listing for ' || p.title || '. Marketplace demo item.', -- Description
  CASE
    WHEN p.id = (SELECT id FROM random_products LIMIT 1 OFFSET 0) THEN 29.99
    WHEN p.id = (SELECT id FROM random_products LIMIT 1 OFFSET 1) THEN 24.99
    ELSE 19.99
  END, -- Different price for each listing
  CASE
    WHEN p.id = (SELECT id FROM random_products LIMIT 1 OFFSET 0) THEN 'new'
    WHEN p.id = (SELECT id FROM random_products LIMIT 1 OFFSET 1) THEN 'very_good'
    ELSE 'good'
  END, -- Different condition for each listing
  2, -- Quantity
  'active', -- Status
  CASE
    WHEN p.id = (SELECT id FROM random_products LIMIT 1 OFFSET 0) THEN 'new'
    WHEN p.id = (SELECT id FROM random_products LIMIT 1 OFFSET 1) THEN 'very_good'
    ELSE 'good'
  END, -- Media condition
  CASE
    WHEN p.id = (SELECT id FROM random_products LIMIT 1 OFFSET 0) THEN 'new'
    WHEN p.id = (SELECT id FROM random_products LIMIT 1 OFFSET 1) THEN 'good'
    ELSE 'acceptable'
  END, -- Sleeve condition
  NOW(), -- Created at
  NOW() -- Updated at
FROM random_products p;

-- Add test listing images for the new listings
INSERT INTO listing_images (
  listing_id,
  url,
  position,
  is_primary
)
SELECT
  id, -- Listing ID
  'https://example.com/test-image-' || ROW_NUMBER() OVER () || '.jpg', -- URL
  1, -- Position
  TRUE -- Is primary
FROM listings
WHERE seller_id = '790a3973-6bca-4092-ba7f-e2a370da42cf'
LIMIT 3; 