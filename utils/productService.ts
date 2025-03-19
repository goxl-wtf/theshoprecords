import { createClient } from '@supabase/supabase-js';
import { Product, ProductWithDetails, Image, Track, Genre, Style } from './types';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images (*),
        genres:product_genres(genres(*)),
        styles:product_styles(styles(*))
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform the data to match our Product type
    const transformedData = data.map(product => {
      return {
        ...product,
        genres: product.genres?.map((g: any) => g.genres) || [],
        styles: product.styles?.map((s: any) => s.styles) || []
      } as Product;
    });

    return transformedData || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Fetch a single product by slug
export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images (*),
        genres:product_genres(genres(*)),
        styles:product_styles(styles(*)),
        tracks (*)
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;

    if (!data) return null;

    // Transform the data to match our Product type
    const transformedData = {
      ...data,
      genres: data.genres?.map((g: any) => g.genres) || [],
      styles: data.styles?.map((s: any) => s.styles) || []
    } as Product;

    return transformedData;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
};

// Search products
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images (*),
        genres:product_genres(genres(*)),
        styles:product_styles(styles(*))
      `)
      .ilike('title', `%${searchTerm}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    // Transform the data to match our Product type
    const transformedData = data.map(product => {
      return {
        ...product,
        genres: product.genres?.map((g: any) => g.genres) || [],
        styles: product.styles?.map((s: any) => s.styles) || []
      } as Product;
    });

    return transformedData || [];
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

// Get all genres
export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const { data, error } = await supabase
      .from('genres')
      .select('*')
      .order('name');

    if (error) throw error;

    return data as Genre[] || [];
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

// Get all styles
export const fetchStyles = async (): Promise<Style[]> => {
  try {
    const { data, error } = await supabase
      .from('styles')
      .select('*')
      .order('name');

    if (error) throw error;

    return data as Style[] || [];
  } catch (error) {
    console.error('Error fetching styles:', error);
    return [];
  }
};

// Fetch products by genre (legacy, single-select)
export const fetchProductsByGenre = async (genreId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('product_genres')
      .select(`
        product_id,
        products:products(
          *,
          images (*),
          genres:product_genres(genres(*)),
          styles:product_styles(styles(*))
        )
      `)
      .eq('genre_id', genreId);

    if (error) throw error;

    // Transform the data to match our Product type
    const transformedData = data.map(item => {
      const product = item.products;
      return {
        ...product,
        genres: product.genres?.map((g: any) => g.genres) || [],
        styles: product.styles?.map((s: any) => s.styles) || []
      } as Product;
    });

    return transformedData || [];
  } catch (error) {
    console.error(`Error fetching products for genre ${genreId}:`, error);
    return [];
  }
};

// Fetch products by style (legacy, single-select)
export const fetchProductsByStyle = async (styleId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('product_styles')
      .select(`
        product_id,
        products:products(
          *,
          images (*),
          genres:product_genres(genres(*)),
          styles:product_styles(styles(*))
        )
      `)
      .eq('style_id', styleId);

    if (error) throw error;

    // Transform the data to match our Product type
    const transformedData = data.map(item => {
      const product = item.products;
      return {
        ...product,
        genres: product.genres?.map((g: any) => g.genres) || [],
        styles: product.styles?.map((s: any) => s.styles) || []
      } as Product;
    });

    return transformedData || [];
  } catch (error) {
    console.error(`Error fetching products for style ${styleId}:`, error);
    return [];
  }
};

// Fetch products by multiple genres
export const fetchProductsByGenres = async (genreIds: string[]): Promise<Product[]> => {
  if (genreIds.length === 0) return [];
  
  try {
    // Get all products that have ANY of the selected genres (we'll filter for ALL later)
    const { data, error } = await supabase
      .from('product_genres')
      .select(`
        product_id,
        products:products(
          *,
          images (*),
          genres:product_genres(genres(*)),
          styles:product_styles(styles(*))
        )
      `)
      .in('genre_id', genreIds);

    if (error) throw error;

    // Transform the data
    const productsWithDuplicates = data.map(item => {
      const product = item.products;
      return {
        ...product,
        genres: product.genres?.map((g: any) => g.genres) || [],
        styles: product.styles?.map((s: any) => s.styles) || []
      } as Product;
    });

    // Group products by id to remove duplicates
    const productMap = new Map<string, Product>();
    productsWithDuplicates.forEach(product => {
      productMap.set(product.id, product);
    });
    
    return Array.from(productMap.values());
  } catch (error) {
    console.error(`Error fetching products for genres:`, error);
    return [];
  }
};

// Fetch products by multiple styles
export const fetchProductsByStyles = async (styleIds: string[]): Promise<Product[]> => {
  if (styleIds.length === 0) return [];
  
  try {
    // Get all products that have ANY of the selected styles (we'll filter for ALL later)
    const { data, error } = await supabase
      .from('product_styles')
      .select(`
        product_id,
        products:products(
          *,
          images (*),
          genres:product_genres(genres(*)),
          styles:product_styles(styles(*))
        )
      `)
      .in('style_id', styleIds);

    if (error) throw error;

    // Transform the data
    const productsWithDuplicates = data.map(item => {
      const product = item.products;
      return {
        ...product,
        genres: product.genres?.map((g: any) => g.genres) || [],
        styles: product.styles?.map((s: any) => s.styles) || []
      } as Product;
    });

    // Group products by id to remove duplicates
    const productMap = new Map<string, Product>();
    productsWithDuplicates.forEach(product => {
      productMap.set(product.id, product);
    });
    
    return Array.from(productMap.values());
  } catch (error) {
    console.error(`Error fetching products for styles:`, error);
    return [];
  }
};

// Fetch products by both genres and styles
export const fetchProductsByGenresAndStyles = async (
  genreIds: string[], 
  styleIds: string[]
): Promise<Product[]> => {
  if (genreIds.length === 0 && styleIds.length === 0) return [];
  
  try {
    let products: Product[] = [];
    
    // If we have genres, start with those
    if (genreIds.length > 0) {
      products = await fetchProductsByGenres(genreIds);
    }
    // Otherwise start with styles
    else {
      products = await fetchProductsByStyles(styleIds);
    }
    
    // If we need to filter by styles too
    if (styleIds.length > 0 && genreIds.length > 0) {
      products = products.filter(product => 
        product.styles.some(style => styleIds.includes(style.id))
      );
    }
    
    return products;
  } catch (error) {
    console.error(`Error fetching products for genres and styles:`, error);
    return [];
  }
};

// Fetch a single product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images (*),
        genres:product_genres(genres(*)),
        styles:product_styles(styles(*)),
        tracks (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return null;

    // Transform the data to match our Product type
    const transformedData = {
      ...data,
      genres: data.genres?.map((g: any) => g.genres) || [],
      styles: data.styles?.map((s: any) => s.styles) || []
    } as Product;

    return transformedData;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}; 