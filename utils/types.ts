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
  first_name?: string;
  last_name?: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  quantity: number;
  totalPrice: number;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
} 