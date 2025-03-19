import { Product, Genre } from './types';
import { searchProducts } from './productService';

export interface SearchSuggestion {
  id: string;
  title: string;
  type: 'album' | 'artist' | 'genre';
  image?: string;
  slug?: string;
}

/**
 * Debounce function to limit how often a function is called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Get search suggestions based on search term
 */
export async function getSearchSuggestions(
  searchTerm: string,
  allProducts: Product[],
  limit: number = 5
): Promise<SearchSuggestion[]> {
  // If search term is too short, return empty array
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }
  
  try {
    // Get products that match search term
    const products = await searchProducts(searchTerm);
    
    // Extract unique artists and album titles
    const artistSet = new Set<string>();
    const albumSet = new Set<string>();
    const genreSet = new Set<string>();
    
    // Track which items we've added to suggestions
    const addedIds = new Set<string>();
    const suggestions: SearchSuggestion[] = [];
    
    // Process products to create suggestions
    products.forEach(product => {
      // Add as album suggestion if we haven't reached the limit
      if (suggestions.filter(s => s.type === 'album').length < limit && !addedIds.has(`album-${product.id}`)) {
        suggestions.push({
          id: `album-${product.id}`,
          title: product.title,
          type: 'album',
          image: product.images?.[0]?.url || undefined,
          slug: product.slug
        });
        addedIds.add(`album-${product.id}`);
        albumSet.add(product.title);
      }
      
      // Extract artist from title (assuming format "Artist - Album Title")
      const artistMatch = product.title.match(/^(.*?)\s-\s/);
      if (artistMatch && artistMatch[1]) {
        const artist = artistMatch[1].trim();
        if (!artistSet.has(artist) && suggestions.filter(s => s.type === 'artist').length < limit) {
          suggestions.push({
            id: `artist-${artist}`,
            title: artist,
            type: 'artist'
          });
          artistSet.add(artist);
        }
      }
      
      // Add genres as suggestions
      product.genres?.forEach(genre => {
        if (
          genre && 
          !genreSet.has(genre.name) && 
          suggestions.filter(s => s.type === 'genre').length < limit
        ) {
          suggestions.push({
            id: `genre-${genre.id}`,
            title: genre.name,
            type: 'genre',
            slug: genre.slug
          });
          genreSet.add(genre.name);
        }
      });
    });
    
    // Sort by relevance (for now just alphabetically within type)
    return suggestions.sort((a, b) => {
      // First sort by type
      if (a.type !== b.type) {
        const typeOrder = { album: 0, artist: 1, genre: 2 };
        return typeOrder[a.type] - typeOrder[b.type];
      }
      // Then sort alphabetically
      return a.title.localeCompare(b.title);
    });
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
} 