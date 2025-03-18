export interface Product {
  id: string;
  discogs_id: number;
  title: string;
  artist: string;
  release_title?: string;
  year?: number;
  country?: string;
  format?: string;
  label?: string;
  barcode?: string;
  description: string;
  notes?: string;
  community_have?: number;
  community_want?: number;
  discogs_url?: string;
  price: number;
  stock: number;
  condition: string;
  created_at?: string;
  updated_at?: string;
}

export interface Image {
  id: string;
  product_id: string;
  url: string;
  discogs_url?: string;
  type: string;
  created_at?: string;
}

export interface Track {
  id: string;
  product_id: string;
  position: string;
  title: string;
  duration?: string;
  created_at?: string;
}

export interface Genre {
  id: string;
  name: string;
  created_at?: string;
}

export interface Style {
  id: string;
  name: string;
  created_at?: string;
}

export interface ProductWithDetails extends Product {
  images?: Image[];
  tracks?: Track[];
  genres?: Genre[];
  styles?: Style[];
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