-- Enable Row Level Security
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_listings ENABLE ROW LEVEL SECURITY;

-- Seller profiles policies
-- Anyone can view seller profiles
CREATE POLICY "Seller profiles are viewable by everyone" 
  ON seller_profiles FOR SELECT 
  USING (true);

-- Only the owner can update their seller profile
CREATE POLICY "Users can update own seller profile" 
  ON seller_profiles FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only the owner can delete their seller profile
CREATE POLICY "Users can delete own seller profile" 
  ON seller_profiles FOR DELETE 
  USING (auth.uid() = user_id);

-- Only authenticated users can insert a seller profile (for themselves)
CREATE POLICY "Users can create seller profile for themselves" 
  ON seller_profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Listings policies
-- All active listings are viewable by everyone
CREATE POLICY "Active listings are viewable by everyone" 
  ON listings FOR SELECT 
  USING (status = 'active' OR seller_id IN (
    SELECT id FROM seller_profiles WHERE user_id = auth.uid()
  ));

-- Sellers can insert their own listings
CREATE POLICY "Sellers can create their own listings" 
  ON listings FOR INSERT 
  WITH CHECK (seller_id IN (
    SELECT id FROM seller_profiles WHERE user_id = auth.uid()
  ));

-- Sellers can update their own listings
CREATE POLICY "Sellers can update their own listings" 
  ON listings FOR UPDATE 
  USING (seller_id IN (
    SELECT id FROM seller_profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (seller_id IN (
    SELECT id FROM seller_profiles WHERE user_id = auth.uid()
  ));

-- Sellers can delete their own listings
CREATE POLICY "Sellers can delete their own listings" 
  ON listings FOR DELETE 
  USING (seller_id IN (
    SELECT id FROM seller_profiles WHERE user_id = auth.uid()
  ));

-- Listing images policies
-- Images of active listings are viewable by everyone
CREATE POLICY "Images of active listings are viewable by everyone" 
  ON listing_images FOR SELECT 
  USING (listing_id IN (
    SELECT id FROM listings WHERE status = 'active' OR seller_id IN (
      SELECT id FROM seller_profiles WHERE user_id = auth.uid()
    )
  ));

-- Sellers can manage images for their own listings
CREATE POLICY "Sellers can add images to their own listings" 
  ON listing_images FOR INSERT 
  WITH CHECK (listing_id IN (
    SELECT id FROM listings WHERE seller_id IN (
      SELECT id FROM seller_profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Sellers can update images of their own listings" 
  ON listing_images FOR UPDATE 
  USING (listing_id IN (
    SELECT id FROM listings WHERE seller_id IN (
      SELECT id FROM seller_profiles WHERE user_id = auth.uid()
    )
  ))
  WITH CHECK (listing_id IN (
    SELECT id FROM listings WHERE seller_id IN (
      SELECT id FROM seller_profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Sellers can delete images of their own listings" 
  ON listing_images FOR DELETE 
  USING (listing_id IN (
    SELECT id FROM listings WHERE seller_id IN (
      SELECT id FROM seller_profiles WHERE user_id = auth.uid()
    )
  ));

-- User listings policies
-- Users can see their own relationships
CREATE POLICY "Users can view their own listing relationships" 
  ON user_listings FOR SELECT 
  USING (user_id = auth.uid() OR listing_id IN (
    SELECT id FROM listings WHERE seller_id IN (
      SELECT id FROM seller_profiles WHERE user_id = auth.uid()
    )
  ));

-- Users can manage their own relationships
CREATE POLICY "Users can create their own listing relationships" 
  ON user_listings FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own listing relationships" 
  ON user_listings FOR UPDATE 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own listing relationships" 
  ON user_listings FOR DELETE 
  USING (user_id = auth.uid()); 