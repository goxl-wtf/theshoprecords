-- Additional indexes for marketplace performance optimization

-- Add index for product_id on listings table
CREATE INDEX IF NOT EXISTS idx_listings_product_id ON listings(product_id);

-- Add index for status on listings table
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);

-- Add index for condition on listings table
CREATE INDEX IF NOT EXISTS idx_listings_condition ON listings(condition);

-- Add index for price on listings table
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);

-- Add composite index for common filters (status + condition)
CREATE INDEX IF NOT EXISTS idx_listings_status_condition ON listings(status, condition);

-- Add composite index for product listing queries (product_id + status)
CREATE INDEX IF NOT EXISTS idx_listings_product_status ON listings(product_id, status);

-- Add index for is_verified on seller_profiles
CREATE INDEX IF NOT EXISTS idx_seller_profiles_is_verified ON seller_profiles(is_verified);

-- Add index for average_rating on seller_profiles
CREATE INDEX IF NOT EXISTS idx_seller_profiles_rating ON seller_profiles(average_rating);

-- Add index for parent_order_id on seller_orders
CREATE INDEX IF NOT EXISTS idx_seller_orders_parent_order_id ON seller_orders(parent_order_id);

-- Add index for status on seller_orders
CREATE INDEX IF NOT EXISTS idx_seller_orders_status ON seller_orders(status); 