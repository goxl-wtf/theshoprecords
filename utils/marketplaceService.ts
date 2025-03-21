import { getSupabase } from './supabase';
import { 
  Listing, 
  ListingImage, 
  SellerProfile, 
  UserListing, 
  ListingStatus, 
  Product 
} from './types';
import globalCache, { generateCacheKey } from './cacheUtils';

// Cache constants
const LISTINGS_CACHE_PREFIX = 'listings';
const PROFILES_CACHE_PREFIX = 'seller_profiles';

// Cache invalidation function
export const invalidateListingsCache = (productId?: string) => {
  if (productId) {
    // Invalidate specific product listings
    globalCache.invalidateByPrefix(`${LISTINGS_CACHE_PREFIX}_product_${productId}`);
  } else {
    // Invalidate all listings
    globalCache.invalidateByPrefix(LISTINGS_CACHE_PREFIX);
  }
};

// Invalidate seller profiles cache
export const invalidateSellerProfilesCache = (userId?: string) => {
  if (userId) {
    // Invalidate specific seller profile
    globalCache.invalidateByPrefix(`${PROFILES_CACHE_PREFIX}_user_${userId}`);
  } else {
    // Invalidate all seller profiles
    globalCache.invalidateByPrefix(PROFILES_CACHE_PREFIX);
  }
};

// ========== Seller Profile Functions ==========

/**
 * Check if a user is a seller based on the is_seller flag
 */
export const isUserSeller = async (userId: string): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase) {
    console.error('Supabase client not initialized in isUserSeller');
    return false;
  }

  try {
    console.log('Checking if user is a seller, userId:', userId);
    
    // Try first approach - check users table for is_seller flag
    // Don't use .single() to avoid 406 errors - just check if any results
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_seller, email, username')
      .eq('id', userId);

    if (!userError && userData && userData.length > 0) {
      // If the user has the is_seller flag, they're a seller
      if (userData[0]?.is_seller) {
        console.log('User is marked as seller in database');
        return true;
      }
      
      // Check if the email indicates a seller
      if (userData[0]?.email?.includes('seller')) {
        console.log('User appears to be a seller based on email, but is_seller flag not set');
        
        // Try to update is_seller flag
        try {
          // First update the user record
          const { error: updateError } = await supabase
            .from('users')
            .update({ is_seller: true })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Failed to update user as seller:', updateError);
          } else {
            console.log('Successfully updated is_seller flag to true');
          }
          
          // Then check if seller profile exists
          const { data: existingProfiles } = await supabase
            .from('seller_profiles')
            .select('id')
            .eq('user_id', userId);
            
          if (!existingProfiles || existingProfiles.length === 0) {
            console.log('No seller profile found, creating one');
            
            // Create seller profile
            const { error: createError } = await supabase
              .from('seller_profiles')
              .insert([{
                user_id: userId,
                store_name: `${userData[0].username || userData[0].email.split('@')[0]}'s Store`,
                is_verified: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }]);
              
            if (createError) {
              console.error('Failed to create seller profile:', createError);
            } else {
              console.log('Successfully created seller profile');
            }
          } else {
            console.log('Seller profile already exists');
          }
        } catch (e) {
          console.error('Exception during seller profile management:', e);
        }
        
        return true;
      }
      
      return false;
    }
    
    // If there's an error or no data, try the second approach
    console.log('First approach failed, trying fallback approach');
    
    // Try directly checking seller_profiles table
    // Don't use .single() to avoid 406 errors
    const { data: sellerData } = await supabase
      .from('seller_profiles')
      .select('user_id')
      .eq('user_id', userId);
      
    if (sellerData && sellerData.length > 0) {
      console.log('User has a seller profile');
      return true;
    }
    
    // Final fallback: check the current session for email pattern
    if (typeof window !== 'undefined') {
      try {
        // Try to get the current user object from the Supabase JS client
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (currentUser && currentUser.email && currentUser.email.includes('seller')) {
          console.log('Current user has seller email:', currentUser.email);
          return true;
        }
        
        // Fallback to session storage
        const sessionStr = sessionStorage.getItem('supabase.auth.token');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          const email = session?.currentSession?.user?.email;
          
          if (email && email.includes('seller')) {
            console.log('Session has seller email:', email);
            return true;
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    }
    
    return false;
  } catch (error) {
    console.error('Exception in isUserSeller function:', error);
    return false;
  }
};

/**
 * Fetch a seller profile by user ID
 */
export const fetchSellerProfileByUserId = async (userId: string): Promise<SellerProfile | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  // Check cache first
  const cacheKey = `${PROFILES_CACHE_PREFIX}_user_${userId}`;
  const cachedData = globalCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // First attempt: Try to get the complete seller profile - don't use .single()
    const { data, error } = await supabase
      .from('seller_profiles')
      .select('*')
      .eq('user_id', userId);

    if (!error && data && data.length > 0) {
      // Cache the result
      globalCache.set(cacheKey, data[0]);
      console.log('Successfully fetched seller profile from database');
      return data[0] as SellerProfile;
    }
    
    // If there was an error or no data, use fallback approach
    console.log('No seller profile found directly, using fallback approach');
    
    // Check if the user is marked as a seller
    const isSeller = await isUserSeller(userId);
    
    if (isSeller) {
      // Fetch basic user information to create a minimal seller profile - don't use .single()
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, email')
        .eq('id', userId);
        
      if (userError || !userData || userData.length === 0) {
        console.log('Could not fetch user data, creating temporary seller profile');
        
        // Try to get current user from auth
        let email = '';
        let tempUsername = '';
        
        try {
          // Get current user from auth
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            email = currentUser.email || '';
            tempUsername = email.split('@')[0] || 'seller';
          }
        } catch (e) {
          console.log('Error getting current user from auth:', e);
        }
        
        // Create a temporary seller profile
        const tempProfile: SellerProfile = {
          id: `temp_${userId}`,
          user_id: userId,
          store_name: `${tempUsername}'s Store`,
          description: 'Temporary seller profile',
          is_verified: false,
          average_rating: 0,
          contact_email: email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Cache the temporary profile
        globalCache.set(cacheKey, tempProfile);
        return tempProfile;
      }
      
      // If we got user data, create a minimal seller profile
      console.log('Creating minimal seller profile from user data');
      const minimalProfile: SellerProfile = {
        id: `fallback_${userData[0].id}`,
        user_id: userData[0].id,
        store_name: userData[0].username ? `${userData[0].username}'s Store` : 'Seller Store',
        description: 'Seller information is limited.',
        is_verified: false,
        average_rating: 0,
        contact_email: userData[0].email || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Try to create the seller profile in the database
      try {
        const { error: createError } = await supabase
          .from('seller_profiles')
          .insert([{
            user_id: userId,
            store_name: minimalProfile.store_name,
            is_verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
          
        if (!createError) {
          console.log('Successfully created seller profile in database');
        }
      } catch (e) {
        console.log('Error creating seller profile in database:', e);
      }
      
      // Cache the minimal profile
      globalCache.set(cacheKey, minimalProfile);
      return minimalProfile;
    }
    
    // Not a seller
    return null;
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    return null;
  }
};

/**
 * Create a new seller profile
 */
export const createSellerProfile = async (
  profile: Omit<SellerProfile, 'id' | 'created_at' | 'updated_at' | 'average_rating'>
): Promise<SellerProfile | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('seller_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data as SellerProfile;
  } catch (error) {
    console.error('Error creating seller profile:', error);
    return null;
  }
};

/**
 * Update a seller profile
 */
export const updateSellerProfile = async (
  id: string,
  updates: Partial<Omit<SellerProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<SellerProfile | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('seller_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as SellerProfile;
  } catch (error) {
    console.error('Error updating seller profile:', error);
    return null;
  }
};

// ========== Listing Functions ==========

/**
 * Fetch all active listings with pagination
 */
export const fetchActiveListings = async (
  page = 1,
  pageSize = 20,
  filters?: {
    genre?: string;
    style?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    sellerId?: string;
    isVerifiedOnly?: boolean;
  }
): Promise<{ listings: Listing[]; totalCount: number; pageCount: number }> => {
  const supabase = getSupabase();
  if (!supabase) return { listings: [], totalCount: 0, pageCount: 0 };

  // Generate cache key based on parameters
  const cacheParams = {
    page,
    pageSize,
    ...filters
  };
  const cacheKey = generateCacheKey(`${LISTINGS_CACHE_PREFIX}_active`, cacheParams);
  
  // Check cache
  const cachedData = globalCache.get(cacheKey);
  if (cachedData) {
    console.log('Using cached listings data');
    return cachedData;
  }

  try {
    // First try with the foreign key relationship approach
    let query = supabase
      .from('listings')
      .select(`
        *,
        seller_profiles!seller_id(user_id, store_name, is_verified, average_rating)
      `, { count: 'exact' })
      .eq('status', 'active');

    // Apply filters if provided
    if (filters) {
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }
      if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.sellerId) {
        query = query.eq('seller_id', filters.sellerId);
      }
      if (filters.isVerifiedOnly) {
        query = query.eq('seller_profiles.is_verified', true);
      }
    }

    // Apply pagination - calculate range
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Execute primary query
    const { data, error, count } = await query;

    // If there's an error with the join, try the manual join approach
    if (error && error.message.includes("Could not find a relationship between 'listings' and 'seller_profiles'")) {
      console.warn('Foreign key relationship not found, using manual join approach');
      return fetchActiveListingsManualJoin(page, pageSize, filters, cacheKey);
    }

    if (error) {
      console.error('Error fetching listings:', error);
      return { listings: [], totalCount: 0, pageCount: 0 };
    }

    // Map the data to rename seller_profiles to seller for backward compatibility
    const listingsWithSeller = data?.map(item => ({
      ...item,
      seller: item.seller_profiles
    }));

    const result = {
      listings: listingsWithSeller as Listing[],
      totalCount: count || 0,
      pageCount: Math.ceil((count || 0) / pageSize)
    };
    
    // Store in cache
    globalCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error('Error fetching active listings:', error);
    // Try the manual join approach as fallback
    return fetchActiveListingsManualJoin(page, pageSize, filters, cacheKey);
  }
};

/**
 * Fallback function to fetch listings with a manual join approach
 */
const fetchActiveListingsManualJoin = async (
  page = 1,
  pageSize = 20,
  filters?: {
    genre?: string;
    style?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    sellerId?: string;
    isVerifiedOnly?: boolean;
  },
  cacheKey?: string
): Promise<{ listings: Listing[]; totalCount: number; pageCount: number }> => {
  const supabase = getSupabase();
  if (!supabase) return { listings: [], totalCount: 0, pageCount: 0 };

  try {
    // Step 1: Get listings with pagination
    let listingsQuery = supabase
      .from('listings')
      .select('*', { count: 'exact' })
      .eq('status', 'active');

    // Apply filters to listings
    if (filters) {
      if (filters.condition) {
        listingsQuery = listingsQuery.eq('condition', filters.condition);
      }
      if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
        listingsQuery = listingsQuery.gte('price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
        listingsQuery = listingsQuery.lte('price', filters.maxPrice);
      }
      if (filters.sellerId) {
        listingsQuery = listingsQuery.eq('seller_id', filters.sellerId);
      }
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    listingsQuery = listingsQuery.range(from, to);

    // Execute listings query
    const { data: listings, error: listingsError, count } = await listingsQuery;

    if (listingsError) {
      console.error('Error fetching listings:', listingsError);
      return { listings: [], totalCount: 0, pageCount: 0 };
    }

    if (!listings || listings.length === 0) {
      return { listings: [], totalCount: 0, pageCount: 0 };
    }

    // Step 2: Get all seller IDs from the listings
    const sellerIds = [...new Set(listings.map(listing => listing.seller_id))];

    // Step 3: Get seller profiles for these IDs
    let sellersQuery = supabase
      .from('seller_profiles')
      .select('user_id, store_name, is_verified, average_rating')
      .in('user_id', sellerIds);

    // Apply verified filter if needed
    if (filters && filters.isVerifiedOnly) {
      sellersQuery = sellersQuery.eq('is_verified', true);
    }

    const { data: sellers, error: sellersError } = await sellersQuery;

    if (sellersError) {
      console.error('Error fetching seller profiles:', sellersError);
      // Return listings without seller data as fallback
      return {
        listings: listings as Listing[],
        totalCount: count || 0,
        pageCount: Math.ceil((count || 0) / pageSize)
      };
    }

    // Step 4: Create a map of seller data by ID
    const sellerMap: Record<string, any> = {};
    sellers?.forEach(seller => {
      sellerMap[seller.user_id] = seller;
    });

    // Step 5: Join the data manually
    const listingsWithSellers = listings.map(listing => ({
      ...listing,
      seller: sellerMap[listing.seller_id] || null
    }));

    // Apply seller-specific filters
    let filteredListings = listingsWithSellers;
    if (filters && filters.isVerifiedOnly) {
      filteredListings = filteredListings.filter(listing => 
        listing.seller && listing.seller.is_verified
      );
    }

    const result = {
      listings: filteredListings as Listing[],
      totalCount: count || 0,
      pageCount: Math.ceil((count || 0) / pageSize)
    };

    // Store in cache if cacheKey is provided
    if (cacheKey) {
      globalCache.set(cacheKey, result);
    }

    return result;
  } catch (error) {
    console.error('Error in manual join approach:', error);
    return { listings: [], totalCount: 0, pageCount: 0 };
  }
};

/**
 * Fetch listings by seller ID
 */
export const fetchListingsBySeller = async (
  sellerId: string,
  status?: ListingStatus
): Promise<Listing[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    let query = supabase
      .from('listings')
      .select(`
        *,
        product:product_id(*)
      `)
      .eq('seller_id', sellerId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as Listing[];
  } catch (error) {
    console.error('Error fetching seller listings:', error);
    return [];
  }
};

/**
 * Fetch listings by product
 */
export const fetchListingsByProduct = async (
  productId: string
): Promise<Listing[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];
  
  // Generate cache key
  const cacheKey = `${LISTINGS_CACHE_PREFIX}_product_${productId}`;
  
  // Check cache
  const cachedData = globalCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // First try with the foreign key relationship approach
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        seller_profiles!seller_id(user_id, store_name, is_verified, average_rating)
      `)
      .eq('product_id', productId)
      .eq('status', 'active');

    // If there's an error with the join, try the manual join approach
    if (error && error.message.includes("Could not find a relationship between 'listings' and 'seller_profiles'")) {
      console.warn('Foreign key relationship not found, using manual join approach for product listings');
      return fetchListingsByProductManualJoin(productId, cacheKey);
    }

    if (error) {
      console.error(`Error fetching listings for product ${productId}:`, error);
      return [];
    }
    
    // Map the data to rename seller_profiles to seller for backward compatibility
    const listingsWithSeller = data?.map(item => ({
      ...item,
      seller: item.seller_profiles
    })) || [];
    
    // Cache the result
    globalCache.set(cacheKey, listingsWithSeller);

    return listingsWithSeller as Listing[];
  } catch (error) {
    console.error(`Error fetching listings for product ${productId}:`, error);
    // Try the manual join approach as fallback
    return fetchListingsByProductManualJoin(productId, cacheKey);
  }
};

/**
 * Fallback function to fetch listings by product with a manual join approach
 */
const fetchListingsByProductManualJoin = async (
  productId: string,
  cacheKey?: string
): Promise<Listing[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    // Step 1: Get listings for the product
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'active');

    if (listingsError) {
      console.error(`Error fetching listings for product ${productId}:`, listingsError);
      return [];
    }

    if (!listings || listings.length === 0) {
      return [];
    }

    // Step 2: Get all seller IDs from the listings
    const sellerIds = [...new Set(listings.map(listing => listing.seller_id))];

    // Step 3: Get seller profiles for these IDs
    const { data: sellers, error: sellersError } = await supabase
      .from('seller_profiles')
      .select('user_id, store_name, is_verified, average_rating')
      .in('user_id', sellerIds);

    if (sellersError) {
      console.error('Error fetching seller profiles:', sellersError);
      // Return listings without seller data as fallback
      return listings as Listing[];
    }

    // Step 4: Create a map of seller data by ID
    const sellerMap: Record<string, any> = {};
    sellers?.forEach(seller => {
      sellerMap[seller.user_id] = seller;
    });

    // Step 5: Join the data manually
    const listingsWithSellers = listings.map(listing => ({
      ...listing,
      seller: sellerMap[listing.seller_id] || null
    }));

    // Store in cache if cacheKey is provided
    if (cacheKey) {
      globalCache.set(cacheKey, listingsWithSellers);
    }

    return listingsWithSellers as Listing[];
  } catch (error) {
    console.error(`Error in manual join approach for product ${productId}:`, error);
    return [];
  }
};

/**
 * Create a new listing
 */
export const createListing = async (
  listing: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'images'>
): Promise<Listing | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('listings')
      .insert(listing)
      .select()
      .single();

    if (error) throw error;
    return data as Listing;
  } catch (error) {
    console.error('Error creating listing:', error);
    return null;
  }
};

/**
 * Update a listing
 */
export const updateListing = async (
  id: string,
  updates: Partial<Omit<Listing, 'id' | 'seller_id' | 'product_id' | 'created_at' | 'updated_at'>>
): Promise<Listing | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('listings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Listing;
  } catch (error) {
    console.error('Error updating listing:', error);
    return null;
  }
};

/**
 * Update a listing's status
 */
export const updateListingStatus = async (
  id: string,
  status: ListingStatus
): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('listings')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating listing status:', error);
    return false;
  }
};

/**
 * Delete a listing
 */
export const deleteListing = async (id: string): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting listing:', error);
    return false;
  }
};

// ========== Listing Images Functions ==========

/**
 * Add images to a listing
 */
export const addListingImages = async (
  images: Omit<ListingImage, 'id' | 'created_at'>[]
): Promise<ListingImage[] | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    // First check if the listing_images table exists
    const { error: tableCheckError } = await supabase
      .from('listing_images')
      .select('id')
      .limit(1);
    
    if (tableCheckError) {
      console.error('listing_images table not found or not accessible:', tableCheckError);
      return null;
    }
    
    const { data, error } = await supabase
      .from('listing_images')
      .insert(images)
      .select();

    if (error) throw error;
    return data as ListingImage[];
  } catch (error) {
    console.error('Error adding listing images:', error);
    return null;
  }
};

/**
 * Delete a listing image
 */
export const deleteListingImage = async (id: string): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    // First check if the listing_images table exists
    const { error: tableCheckError } = await supabase
      .from('listing_images')
      .select('id')
      .limit(1);
    
    if (tableCheckError) {
      console.error('listing_images table not found or not accessible:', tableCheckError);
      return false;
    }
    
    const { error } = await supabase
      .from('listing_images')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting listing image:', error);
    return false;
  }
};

// ========== User Listings Functions ==========

/**
 * Get user's listings
 */
export const getUserListings = async (
  userId: string,
  relationshipType?: string
): Promise<UserListing[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    let query = supabase
      .from('user_listings')
      .select(`
        *,
        listing:listing_id(
          id,
          title,
          price,
          condition,
          status,
          seller_id
        )
      `)
      .eq('user_id', userId);

    if (relationshipType) {
      query = query.eq('relationship_type', relationshipType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as UserListing[];
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return [];
  }
};

/**
 * Add a user listing
 */
export const addUserListing = async (
  userListing: Omit<UserListing, 'id' | 'created_at'>
): Promise<UserListing | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('user_listings')
      .insert(userListing)
      .select()
      .single();

    if (error) throw error;
    return data as UserListing;
  } catch (error) {
    console.error('Error adding user listing:', error);
    return null;
  }
};

/**
 * Remove a user listing
 */
export const removeUserListing = async (
  userId: string,
  listingId: string
): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('user_listings')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing user listing:', error);
    return false;
  }
};

// ========== Product Functions ==========
// These are helpers for marketplace-related product operations

/**
 * Create a new product (for sellers)
 */
export async function createProduct(productData: Partial<Product>): Promise<Product | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
} 