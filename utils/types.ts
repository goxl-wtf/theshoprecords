export interface Product {
  id: string;
  discogs_id?: string;
  title: string;
  artist: string;
  slug: string;
  price: number;
  description?: string;
  year?: number;
  format?: string;
  condition?: string;
  created_at?: string;
  updated_at?: string;
  in_stock: boolean;
  featured?: boolean;
  images: Image[];
  genres: Genre[];
  styles: Style[];
  tracks?: Track[];
  listings?: Listing[];
}

// Adding ProductWithDetails type which is equivalent to Product
// Used in various components throughout the application
export type ProductWithDetails = Product;

export interface Image {
  id: string;
  product_id: string;
  url: string;
  position?: number;
  is_primary?: boolean;
  created_at?: string;
}

export interface Track {
  id: string;
  product_id: string;
  title: string;
  position: number;
  duration?: string;
  created_at?: string;
}

export interface Genre {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  created_at?: string;
}

export interface Style {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  auth_id?: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  is_seller?: boolean;
  seller_profile?: SellerProfile;
}

export interface CartItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  quantity: number;
  totalPrice: number;
  seller_id?: string;
  seller_name?: string;
  listing_id?: string;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
}

// New interfaces for marketplace functionality

export interface SellerProfile {
  id: string;
  user_id: string;
  store_name: string;
  description?: string;
  logo_url?: string;
  contact_email?: string;
  payment_details?: any;
  average_rating?: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  listings?: Listing[];
}

export interface Listing {
  id: string;
  seller_id: string;
  product_id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  condition: string;
  quantity: number;
  status: ListingStatus;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  seller?: SellerProfile;
  product?: Product;
  images?: ListingImage[];
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  position?: number;
  is_primary: boolean;
  created_at: string;
}

export interface UserListing {
  id: string;
  user_id: string;
  listing_id: string;
  relationship_type: string;
  created_at: string;
  user?: User;
  listing?: Listing;
}

// Enum types for marketplace

export type ListingStatus = 'active' | 'sold' | 'pending' | 'draft' | 'removed';

export type ListingCondition = 'mint' | 'near_mint' | 'very_good' | 'good' | 'fair' | 'poor'; 