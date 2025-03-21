-- MARKETPLACE SCHEMA FIX SCRIPT (FINAL)
-- Run this script in Supabase SQL Editor to fix the marketplace schema issues

-- 1. Update seller_profiles table to add missing columns and maintain existing ones
-- Check if shop_name column exists before trying to rename it
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'seller_profiles' 
        AND column_name = 'shop_name'
    ) THEN
        ALTER TABLE seller_profiles RENAME COLUMN shop_name TO store_name;
        RAISE NOTICE 'Renamed shop_name to store_name in seller_profiles table';
    ELSIF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'seller_profiles' 
        AND column_name = 'store_name'
    ) THEN
        ALTER TABLE seller_profiles ADD COLUMN store_name TEXT;
        RAISE NOTICE 'Added store_name column to seller_profiles table';
    END IF;
END$$;

-- Check if shop_description column exists before trying to rename it
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'seller_profiles' 
        AND column_name = 'shop_description'
    ) THEN
        ALTER TABLE seller_profiles RENAME COLUMN shop_description TO description;
        RAISE NOTICE 'Renamed shop_description to description in seller_profiles table';
    ELSIF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'seller_profiles' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE seller_profiles ADD COLUMN description TEXT;
        RAISE NOTICE 'Added description column to seller_profiles table';
    END IF;
END$$;

-- Add missing columns to seller_profiles
ALTER TABLE seller_profiles 
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS payment_details JSONB,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS average_rating NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create missing listing_images table
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL,
  url TEXT NOT NULL,
  position INTEGER,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on listing_id for better performance
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);

-- Add foreign key constraint to link listing_images to listings (only if listings.id exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'listings' 
        AND column_name = 'id'
    ) THEN
        -- Check if constraint already exists
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.table_constraints
            WHERE constraint_name = 'fk_listing_images_listing_id'
            AND table_name = 'listing_images'
        ) THEN
            ALTER TABLE listing_images 
              ADD CONSTRAINT fk_listing_images_listing_id 
              FOREIGN KEY (listing_id) 
              REFERENCES listings(id) 
              ON DELETE CASCADE;
            RAISE NOTICE 'Added foreign key constraint between listing_images and listings';
        END IF;
    ELSE
        RAISE NOTICE 'Could not add foreign key for listing_images: listings.id does not exist';
    END IF;
END$$;

-- 3. Create missing seller_orders table
CREATE TABLE IF NOT EXISTS seller_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_order_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  shipping_option TEXT DEFAULT 'standard',
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seller_orders_parent_order_id ON seller_orders(parent_order_id);
CREATE INDEX IF NOT EXISTS idx_seller_orders_seller_id ON seller_orders(seller_id);

-- Add foreign key constraints to seller_orders (only if referenced columns exist)
DO $$
BEGIN
    -- Check for orders.id
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'id'
    ) THEN
        -- Check if constraint already exists
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.table_constraints
            WHERE constraint_name = 'fk_seller_orders_parent_order_id'
            AND table_name = 'seller_orders'
        ) THEN
            ALTER TABLE seller_orders 
              ADD CONSTRAINT fk_seller_orders_parent_order_id 
              FOREIGN KEY (parent_order_id) 
              REFERENCES orders(id) 
              ON DELETE CASCADE;
            RAISE NOTICE 'Added foreign key constraint between seller_orders and orders';
        END IF;
    ELSE
        RAISE NOTICE 'Could not add foreign key for seller_orders: orders.id does not exist';
    END IF;
    
    -- Check for seller_profiles.user_id (using SUPABASE RECOMMENDED FIX)
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'seller_profiles' 
        AND column_name = 'user_id'
    ) THEN
        -- Check if constraint already exists
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.table_constraints
            WHERE constraint_name = 'fk_seller_orders_seller_id'
            AND table_name = 'seller_orders'
        ) THEN
            -- Using user_id as the reference for seller_id as per Supabase suggestion
            ALTER TABLE seller_orders 
              ADD CONSTRAINT fk_seller_orders_seller_id 
              FOREIGN KEY (seller_id) 
              REFERENCES seller_profiles(user_id) 
              ON DELETE CASCADE;
            RAISE NOTICE 'Added foreign key constraint between seller_orders and seller_profiles(user_id)';
        END IF;
    ELSE
        RAISE NOTICE 'Could not add foreign key for seller_orders: seller_profiles.user_id does not exist';
    END IF;
END$$;

-- 4. Update listings table with missing columns and proper condition column
ALTER TABLE listings
  -- Add title and description if missing
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Convert media_condition to condition (required by the code)
-- First check if condition column doesn't exist yet
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'listings' 
    AND column_name = 'condition'
  ) THEN
    -- Add condition column
    ALTER TABLE listings ADD COLUMN condition TEXT;
    
    -- Check if media_condition exists and update condition from it
    IF EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'listings' 
      AND column_name = 'media_condition'
    ) THEN
      UPDATE listings SET condition = media_condition;
      RAISE NOTICE 'Updated condition column from media_condition';
    END IF;
  END IF;
END$$;

-- Add the crucial foreign key relationship between listings.seller_id and seller_profiles.user_id
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

-- 5. Create test seller profile (only if it doesn't exist)
DO $$
DECLARE
  user_exists BOOLEAN;
  test_user_id UUID;
BEGIN
  -- Check if we have any users
  SELECT EXISTS (
    SELECT 1 
    FROM users 
    LIMIT 1
  ) INTO user_exists;
  
  IF user_exists THEN
    -- Get a user ID
    SELECT id INTO test_user_id FROM users LIMIT 1;
    
    -- Insert test seller profile
    INSERT INTO seller_profiles (
      user_id,
      store_name,
      description,
      contact_email,
      is_verified,
      average_rating
    ) 
    VALUES (
      test_user_id,
      'Test Record Shop',
      'A test seller account for marketplace testing',
      'test@example.com',
      TRUE,
      4.5
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Created test seller profile for user %', test_user_id;
  ELSE
    RAISE NOTICE 'No users found. Cannot create test seller profile.';
  END IF;
END$$;

-- 6. Create test listings for the test seller
DO $$
DECLARE
  test_seller_id UUID;
  product_id UUID;
BEGIN
  -- Get the seller ID (user_id from seller_profiles)
  SELECT user_id INTO test_seller_id FROM seller_profiles 
  LIMIT 1;
  
  IF test_seller_id IS NULL THEN
    RAISE NOTICE 'No seller profiles found.';
    RETURN;
  END IF;
  
  -- Get a product ID
  SELECT id INTO product_id FROM products LIMIT 1;
  
  IF product_id IS NULL THEN
    RAISE NOTICE 'No products found.';
    RETURN;
  END IF;
  
  -- Create a test listing for the product if it doesn't exist
  INSERT INTO listings (
    seller_id,
    product_id,
    title,
    description,
    price,
    condition,
    quantity,
    status
  )
  SELECT
    test_seller_id,
    product_id,
    p.title,
    'Test listing for marketplace testing. Very good condition with minimal wear.',
    p.price * 0.9, -- 10% discount
    'very_good',
    1,
    'active'
  FROM products p
  WHERE p.id = product_id
  AND NOT EXISTS (
    SELECT 1 FROM listings l 
    WHERE l.seller_id = test_seller_id 
    AND l.product_id = product_id
  );
  
  -- Get another product ID for a second listing
  SELECT id INTO product_id FROM products 
  ORDER BY id
  OFFSET 1
  LIMIT 1;
  
  IF product_id IS NULL THEN
    RAISE NOTICE 'No additional products found.';
    RETURN;
  END IF;
  
  -- Create a second test listing for another product
  INSERT INTO listings (
    seller_id,
    product_id,
    title,
    description,
    price,
    condition,
    quantity,
    status
  )
  SELECT
    test_seller_id,
    product_id,
    p.title,
    'Another test listing. Good condition with some minor wear.',
    p.price * 0.85, -- 15% discount
    'good',
    1,
    'active'
  FROM products p
  WHERE p.id = product_id
  AND NOT EXISTS (
    SELECT 1 FROM listings l 
    WHERE l.seller_id = test_seller_id 
    AND l.product_id = product_id
  );
END;
$$;

-- 7. Add performance optimizations: additional indexes
CREATE INDEX IF NOT EXISTS idx_listings_product_id ON listings(product_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_condition ON listings(condition);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_status_condition ON listings(status, condition);
CREATE INDEX IF NOT EXISTS idx_listings_product_status ON listings(product_id, status);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_is_verified ON seller_profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_rating ON seller_profiles(average_rating); 