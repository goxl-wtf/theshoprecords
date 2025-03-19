-- Migration script to convert existing products to marketplace listings

-- First, create a default admin seller profile if it doesn't exist
DO $$
DECLARE
  admin_user_id UUID;
  admin_seller_id UUID;
BEGIN
  -- Check if there's an admin user with email 'admin@theshoprecords.com'
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@theshoprecords.com' LIMIT 1;

  -- If admin user doesn't exist, create one (depends on your auth setup)
  IF admin_user_id IS NULL THEN
    -- This is a placeholder - you may need to modify this based on your auth setup
    -- Actual user creation might require using auth.create_user() in RLS disabled context
    RAISE NOTICE 'Admin user not found. Please create a user with email admin@theshoprecords.com first.';
  ELSE
    -- Check if the admin user already has a seller profile
    SELECT id INTO admin_seller_id FROM seller_profiles WHERE user_id = admin_user_id LIMIT 1;
    
    -- If admin seller profile doesn't exist, create one
    IF admin_seller_id IS NULL THEN
      INSERT INTO seller_profiles (
        user_id, 
        store_name, 
        description, 
        logo_url, 
        contact_email, 
        is_verified
      ) VALUES (
        admin_user_id,
        'TheShopRecords Official',
        'The official store of TheShopRecords - your trusted source for vinyl records.',
        'https://example.com/theshoprecords-logo.png',
        'admin@theshoprecords.com',
        TRUE
      )
      RETURNING id INTO admin_seller_id;
      
      RAISE NOTICE 'Created admin seller profile with ID %', admin_seller_id;
    ELSE
      RAISE NOTICE 'Admin seller profile already exists with ID %', admin_seller_id;
    END IF;
    
    -- Now convert existing products to listings
    -- This assumes your products table is already populated
    INSERT INTO listings (
      seller_id,
      product_id,
      title,
      description,
      price,
      condition,
      quantity,
      status,
      is_featured,
      created_at,
      updated_at
    )
    SELECT 
      admin_seller_id,
      p.id,
      p.title,
      p.description,
      p.price,
      COALESCE(p.condition, 'near_mint'),
      CASE WHEN p.in_stock THEN 1 ELSE 0 END,
      CASE WHEN p.in_stock THEN 'active' ELSE 'sold' END,
      COALESCE(p.featured, FALSE),
      p.created_at,
      p.updated_at
    FROM products p
    WHERE NOT EXISTS (
      -- Skip products that already have listings
      SELECT 1 FROM listings l WHERE l.product_id = p.id
    );
    
    RAISE NOTICE 'Migration complete. Existing products converted to listings.';
  END IF;
END
$$; 