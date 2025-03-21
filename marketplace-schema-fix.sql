-- First, create the pgclient function if needed
CREATE OR REPLACE FUNCTION pgclient(query text)
RETURNS jsonb AS $$
BEGIN
  EXECUTE query;
  RETURN '{"success": true}'::jsonb;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create seller_profiles table (or update if exists)
CREATE TABLE IF NOT EXISTS seller_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  store_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  contact_email TEXT,
  payment_details JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_seller_profiles_user_id ON seller_profiles(user_id);

-- Create missing listing_images table
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL,
  url TEXT NOT NULL,
  position INTEGER,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on listing_id for better performance
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);

-- Add foreign key constraint to link listing_images to listings
DO $$
BEGIN
  -- Check if the constraint already exists
  IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'fk_listing_images_listing_id'
  ) THEN
    ALTER TABLE listing_images 
      ADD CONSTRAINT fk_listing_images_listing_id 
      FOREIGN KEY (listing_id) 
      REFERENCES listings(id) 
      ON DELETE CASCADE;
  END IF;
END$$;

-- Create missing seller_orders table
CREATE TABLE IF NOT EXISTS seller_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Add foreign key constraints to seller_orders
DO $$
BEGIN
  -- Check if the constraint already exists
  IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'fk_seller_orders_parent_order_id'
  ) THEN
    ALTER TABLE seller_orders 
      ADD CONSTRAINT fk_seller_orders_parent_order_id 
      FOREIGN KEY (parent_order_id) 
      REFERENCES orders(id) 
      ON DELETE CASCADE;
  END IF;
END$$;

DO $$
BEGIN
  -- Check if the constraint already exists
  IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'fk_seller_orders_seller_id'
  ) THEN
    ALTER TABLE seller_orders 
      ADD CONSTRAINT fk_seller_orders_seller_id 
      FOREIGN KEY (seller_id) 
      REFERENCES seller_profiles(id) 
      ON DELETE CASCADE;
  END IF;
END$$;

-- Create test seller profile (only if it doesn't exist)
INSERT INTO seller_profiles (
  user_id,
  store_name,
  description,
  contact_email,
  is_verified
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test Record Shop',
  'A test seller account for marketplace testing',
  'test@example.com',
  TRUE
)
ON CONFLICT (user_id) DO NOTHING;

-- Create test listings for the test seller
DO $$
DECLARE
  test_seller_id UUID;
  product_id UUID;
BEGIN
  -- Get the seller ID
  SELECT id INTO test_seller_id FROM seller_profiles 
  WHERE user_id = '00000000-0000-0000-0000-000000000001' 
  LIMIT 1;
  
  IF test_seller_id IS NULL THEN
    RAISE NOTICE 'Test seller profile not found.';
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
  SELECT id INTO product_id FROM products WHERE id != product_id LIMIT 1;
  
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