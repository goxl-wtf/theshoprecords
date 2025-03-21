-- SQL script to temporarily disable RLS, create a seller profile, and re-enable RLS
-- Run this directly in the Supabase SQL Editor

-- 1. Temporarily disable RLS on seller_profiles table
ALTER TABLE seller_profiles DISABLE ROW LEVEL SECURITY;

-- 2. Insert the seller profile
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

-- 3. Verify the insertion
SELECT * FROM seller_profiles WHERE user_id = '790a3973-6bca-4092-ba7f-e2a370da42cf';

-- 4. Re-enable RLS on seller_profiles table
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY; 