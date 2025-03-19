import { getSupabase } from './supabase';
import { 
  Listing, 
  ListingImage, 
  SellerProfile, 
  UserListing, 
  ListingStatus, 
  Product 
} from './types';

// ========== Seller Profile Functions ==========

/**
 * Fetch a seller profile by user ID
 */
export const fetchSellerProfileByUserId = async (userId: string): Promise<SellerProfile | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('seller_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as SellerProfile;
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
 * Fetch all active listings
 */
export const fetchActiveListings = async (
  page = 1,
  limit = 20,
  filters?: {
    genre?: string;
    style?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
  }
): Promise<{ listings: Listing[]; count: number }> => {
  const supabase = getSupabase();
  if (!supabase) return { listings: [], count: 0 };

  try {
    let query = supabase
      .from('listings')
      .select(`
        *,
        seller:seller_id(id, store_name, is_verified, average_rating),
        product:product_id(*),
        images:listing_images(*)
      `, { count: 'exact' })
      .eq('status', 'active');

    // Apply filters if provided
    if (filters) {
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      listings: (data || []) as Listing[],
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching active listings:', error);
    return { listings: [], count: 0 };
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
        product:product_id(*),
        images:listing_images(*)
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
 * Fetch listings by product ID
 */
export const fetchListingsByProduct = async (
  productId: string
): Promise<Listing[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        seller:seller_id(*),
        images:listing_images(*)
      `)
      .eq('product_id', productId)
      .eq('status', 'active');

    if (error) throw error;
    return (data || []) as Listing[];
  } catch (error) {
    console.error('Error fetching product listings:', error);
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
 * Update listing status
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
 * Get user's listings (saved/favorited)
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
        listing:listing_id(*)
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
 * Add a listing to user's saved/favorited listings
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
 * Remove a listing from user's saved/favorited listings
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

/**
 * Creates a new product in the database
 */
export async function createProduct(productData: Partial<Product>): Promise<Product | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    // Separate the nested data (images, tracks, genres, styles)
    const { images, tracks, genres, styles, ...mainProductData } = productData;

    // Create a slug from the title if none is provided
    if (!mainProductData.slug && mainProductData.title) {
      mainProductData.slug = mainProductData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    }

    // Insert the main product data
    const { data: productResult, error: productError } = await supabase
      .from('products')
      .insert([{ ...mainProductData, in_stock: true }])
      .select('*')
      .single();

    if (productError) throw productError;
    if (!productResult) throw new Error('Failed to create product');

    const productId = productResult.id;

    // Insert images if provided
    if (images && images.length > 0) {
      const imagesToInsert = images.map(img => ({
        ...img,
        product_id: productId,
        id: undefined // Let the database generate IDs
      }));

      const { error: imagesError } = await supabase
        .from('images')
        .insert(imagesToInsert);

      if (imagesError) console.error('Error inserting images:', imagesError);
    }

    // Insert tracks if provided
    if (tracks && tracks.length > 0) {
      const tracksToInsert = tracks.map(track => ({
        ...track,
        product_id: productId,
        id: undefined // Let the database generate IDs
      }));

      const { error: tracksError } = await supabase
        .from('tracks')
        .insert(tracksToInsert);

      if (tracksError) console.error('Error inserting tracks:', tracksError);
    }

    // Handle genres and styles with junction tables
    if (genres && genres.length > 0) {
      // First, check which genres already exist and which need to be created
      const existingGenres = await Promise.all(
        genres.map(async (genre) => {
          const { data, error } = await supabase
            .from('genres')
            .select('*')
            .eq('name', genre.name)
            .limit(1);
          
          if (error) throw error;
          return data && data.length > 0 ? data[0] : null;
        })
      );

      // Create any new genres
      const genresToCreate = genres.filter((_, i) => !existingGenres[i]);
      let newGenres: any[] = [];
      
      if (genresToCreate.length > 0) {
        const genresData = genresToCreate.map(g => ({
          name: g.name,
          slug: g.slug || g.name.toLowerCase().replace(/\s+/g, '-')
        }));
        
        const { data, error } = await supabase
          .from('genres')
          .insert(genresData)
          .select('*');
          
        if (error) throw error;
        if (data) newGenres = data;
      }

      // Combine existing and new genres
      const allGenres = existingGenres
        .filter(g => g !== null)
        .concat(newGenres);

      // Create junction table entries
      const junctionEntries = allGenres.map(genre => ({
        product_id: productId,
        genre_id: genre.id
      }));

      if (junctionEntries.length > 0) {
        const { error: junctionError } = await supabase
          .from('product_genres')
          .insert(junctionEntries);

        if (junctionError) console.error('Error linking genres:', junctionError);
      }
    }

    // Handle styles similarly to genres
    if (styles && styles.length > 0) {
      // Check existing styles
      const existingStyles = await Promise.all(
        styles.map(async (style) => {
          const { data, error } = await supabase
            .from('styles')
            .select('*')
            .eq('name', style.name)
            .limit(1);
          
          if (error) throw error;
          return data && data.length > 0 ? data[0] : null;
        })
      );

      // Create new styles
      const stylesToCreate = styles.filter((_, i) => !existingStyles[i]);
      let newStyles: any[] = [];
      
      if (stylesToCreate.length > 0) {
        const stylesData = stylesToCreate.map(s => ({
          name: s.name,
          slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-')
        }));
        
        const { data, error } = await supabase
          .from('styles')
          .insert(stylesData)
          .select('*');
          
        if (error) throw error;
        if (data) newStyles = data;
      }

      // Combine existing and new styles
      const allStyles = existingStyles
        .filter(s => s !== null)
        .concat(newStyles);

      // Create junction table entries
      const junctionEntries = allStyles.map(style => ({
        product_id: productId,
        style_id: style.id
      }));

      if (junctionEntries.length > 0) {
        const { error: junctionError } = await supabase
          .from('product_styles')
          .insert(junctionEntries);

        if (junctionError) console.error('Error linking styles:', junctionError);
      }
    }

    return productResult;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

/**
 * Updates an existing product in the database
 */
export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    // We only update the main product record here, not the related entities
    const { images, tracks, genres, styles, ...mainProductData } = productData;

    const { data, error } = await supabase
      .from('products')
      .update(mainProductData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
} 