import supabase from './supabase';
import { Product, ProductWithDetails, Image, Track, Genre, Style } from './types';

// Define Supabase join table response types
interface ProductGenreJoin {
  genres: Genre;
}

interface ProductStyleJoin {
  styles: Style;
}

interface ProductGenreResult {
  products: Product;
}

interface ProductStyleResult {
  products: Product;
}

export const fetchProducts = async (): Promise<ProductWithDetails[]> => {
  // Enhanced query to include images with each product
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images (*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data as ProductWithDetails[] || [];
};

export const fetchProductById = async (id: string): Promise<ProductWithDetails | null> => {
  // Fetch the product
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (productError || !product) {
    console.error('Error fetching product:', productError);
    return null;
  }
  
  // Fetch images
  const { data: images, error: imagesError } = await supabase
    .from('images')
    .select('*')
    .eq('product_id', id);
  
  if (imagesError) {
    console.error('Error fetching images:', imagesError);
  }
  
  // Fetch tracks
  const { data: tracks, error: tracksError } = await supabase
    .from('tracks')
    .select('*')
    .eq('product_id', id)
    .order('position');
  
  if (tracksError) {
    console.error('Error fetching tracks:', tracksError);
  }
  
  // Fetch genres - Use a simplified approach for genres and styles
  const { data: productGenres, error: genresError } = await supabase
    .from('product_genres')
    .select(`
      genre_id,
      genres:genres(id, name)
    `)
    .eq('product_id', id);
  
  if (genresError) {
    console.error('Error fetching genres:', genresError);
  }
  
  // Fetch styles
  const { data: productStyles, error: stylesError } = await supabase
    .from('product_styles')
    .select(`
      style_id,
      styles:styles(id, name)
    `)
    .eq('product_id', id);
  
  if (stylesError) {
    console.error('Error fetching styles:', stylesError);
  }
  
  // Extract genres and styles from join tables safely
  const genres: Genre[] = [];
  const styles: Style[] = [];
  
  if (productGenres) {
    productGenres.forEach(pg => {
      if (pg.genres) {
        genres.push(pg.genres as unknown as Genre);
      }
    });
  }
  
  if (productStyles) {
    productStyles.forEach(ps => {
      if (ps.styles) {
        styles.push(ps.styles as unknown as Style);
      }
    });
  }
  
  // Return the product with all related data
  return {
    ...product,
    images: images as Image[] || [],
    tracks: tracks as Track[] || [],
    genres,
    styles
  };
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query || query.trim() === '') {
    return fetchProducts();
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .textSearch('search_vector', query);
    
  if (error) {
    console.error('Error searching products:', error);
    return [];
  }
  
  return data as Product[] || [];
};

export const fetchGenres = async (): Promise<Genre[]> => {
  const { data, error } = await supabase
    .from('genres')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
  
  return data as Genre[] || [];
};

export const fetchStyles = async (): Promise<Style[]> => {
  const { data, error } = await supabase
    .from('styles')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching styles:', error);
    return [];
  }
  
  return data as Style[] || [];
};

export const fetchProductsByGenre = async (genreId: string): Promise<Product[]> => {
  // Use a direct join to get products by genre
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_genres!inner(genre_id)
    `)
    .eq('product_genres.genre_id', genreId);
    
  if (error) {
    console.error('Error fetching products by genre:', error);
    return [];
  }
  
  return data as Product[] || [];
};

export const fetchProductsByStyle = async (styleId: string): Promise<Product[]> => {
  // Use a direct join to get products by style
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_styles!inner(style_id)
    `)
    .eq('product_styles.style_id', styleId);
    
  if (error) {
    console.error('Error fetching products by style:', error);
    return [];
  }
  
  return data as Product[] || [];
}; 