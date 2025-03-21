-- SQL script to bypass RLS and create test seller profile
-- Run this in the Supabase SQL Editor

-- First, create a function to bypass RLS
CREATE OR REPLACE FUNCTION create_test_seller_profile()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  test_seller_id UUID := '790a3973-6bca-4092-ba7f-e2a370da42cf'; -- ID of the test seller from check-users-table.js
  profile_exists BOOLEAN;
  result JSONB;
BEGIN
  -- Check if profile already exists
  SELECT EXISTS (
    SELECT 1 
    FROM seller_profiles 
    WHERE user_id = test_seller_id
  ) INTO profile_exists;
  
  IF profile_exists THEN
    -- Update existing profile
    UPDATE seller_profiles
    SET 
      store_name = 'Test Record Shop',
      description = 'A test seller account for marketplace testing with SECURITY DEFINER bypass',
      contact_email = 'seller@test.nl',
      is_verified = TRUE,
      average_rating = 4.9,
      updated_at = NOW()
    WHERE user_id = test_seller_id;
    
    result := jsonb_build_object(
      'success', true,
      'message', 'Updated existing seller profile',
      'user_id', test_seller_id
    );
  ELSE
    -- Create new profile
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
      'A test seller account for marketplace testing with SECURITY DEFINER bypass',
      'seller@test.nl',
      TRUE,
      4.9,
      NOW(),
      NOW()
    );
    
    result := jsonb_build_object(
      'success', true,
      'message', 'Created new seller profile',
      'user_id', test_seller_id
    );
  END IF;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- Call the function to create the seller profile
SELECT create_test_seller_profile();

-- Also fix the foreign key relationship
DO $$
BEGIN
  -- Check if the foreign key constraint already exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_listings_seller_id'
    AND table_name = 'listings'
  ) THEN
    -- Add the foreign key constraint
    ALTER TABLE listings 
      ADD CONSTRAINT fk_listings_seller_id 
      FOREIGN KEY (seller_id) 
      REFERENCES seller_profiles(user_id) 
      ON DELETE CASCADE;
    RAISE NOTICE 'Added foreign key constraint between listings.seller_id and seller_profiles.user_id';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Could not add foreign key constraint: %', SQLERRM;
END$$;

-- Create a simple function to get seller profiles (bypassing RLS)
CREATE OR REPLACE FUNCTION get_seller_profiles()
RETURNS SETOF seller_profiles
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM seller_profiles;
$$;

-- Create a function to get listings with seller profiles (bypassing RLS)
CREATE OR REPLACE FUNCTION get_listings_with_sellers()
RETURNS TABLE (
  listing_id UUID,
  product_id UUID,
  title TEXT,
  price DECIMAL,
  condition TEXT,
  seller_id UUID,
  store_name TEXT,
  is_verified BOOLEAN,
  average_rating DECIMAL
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    l.id as listing_id,
    l.product_id,
    l.title,
    l.price,
    l.condition,
    s.user_id as seller_id,
    s.store_name,
    s.is_verified,
    s.average_rating
  FROM 
    listings l
  LEFT JOIN 
    seller_profiles s ON l.seller_id = s.user_id
  WHERE 
    l.status = 'active';
$$; 