import { getSupabase } from './supabaseClient';
import { Product } from './types';
import { searchReleases, getReleaseDetails } from './discogsService';

/**
 * Searches Discogs for potential matches to a product
 */
export async function findPotentialMatches(product: Product, limit: number = 5): Promise<any[]> {
  try {
    // Create a search query based on product title and artist
    const query = `${product.artist} ${product.title}`;
    const result = await searchReleases(query, 1, limit);
    
    if ('message' in result) {
      console.error(`Error searching Discogs: ${result.message}`);
      return [];
    }
    
    return result.results;
  } catch (error) {
    console.error('Error finding potential matches:', error);
    return [];
  }
}

/**
 * Links a product to a Discogs release by ID
 */
export async function linkProductToDiscogs(
  productId: string, 
  discogsId: number
): Promise<boolean> {
  try {
    const supabase = getSupabase();
    if (!supabase) return false;
    
    // Update the product with the Discogs ID
    const { error } = await supabase
      .from('products')
      .update({ discogs_id: discogsId.toString() })
      .eq('id', productId);
    
    if (error) {
      console.error('Error linking product to Discogs:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error linking product to Discogs:', error);
    return false;
  }
}

/**
 * Enriches product data with additional information from Discogs
 */
export async function enrichProductWithDiscogsData(
  productId: string, 
  discogsId: number
): Promise<boolean> {
  try {
    const supabase = getSupabase();
    if (!supabase) return false;
    
    // Get release details from Discogs
    const releaseDetails = await getReleaseDetails(discogsId);
    
    if ('message' in releaseDetails) {
      console.error(`Error getting release details: ${releaseDetails.message}`);
      return false;
    }
    
    // Prepare data update with available fields
    const updates: Partial<Product> = {
      discogs_id: discogsId.toString(),
      year: releaseDetails.year || undefined,
      // Generate a description from available fields
      description: `${releaseDetails.artists?.[0]?.name || 'Unknown Artist'} - ${releaseDetails.title} (${releaseDetails.year || 'Unknown Year'}). Format: ${releaseDetails.formats?.map(f => f.name).join(', ') || 'Unknown'}.`
    };
    
    // Update the product
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId);
    
    if (error) {
      console.error('Error enriching product data:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error enriching product with Discogs data:', error);
    return false;
  }
}

/**
 * Gets all products that don't have a Discogs ID
 */
export async function getProductsWithoutDiscogsId(
  limit: number = 50, 
  offset: number = 0
): Promise<Product[]> {
  try {
    const supabase = getSupabase();
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .is('discogs_id', null)
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error getting products without Discogs ID:', error);
      return [];
    }
    
    return data as Product[];
  } catch (error) {
    console.error('Error getting products without Discogs ID:', error);
    return [];
  }
}

/**
 * Batch process to attempt linking products to Discogs
 * This is a simplified example - in production, you would want
 * to implement more sophisticated matching logic and manual review
 */
export async function batchLinkProductsToDiscogs(
  batchSize: number = 10
): Promise<{ success: number; failed: number }> {
  let successCount = 0;
  let failedCount = 0;
  
  try {
    // Get products without Discogs ID
    const products = await getProductsWithoutDiscogsId(batchSize);
    
    for (const product of products) {
      // Find potential matches
      const matches = await findPotentialMatches(product, 1);
      
      if (matches.length > 0) {
        // Take the first match (in a real application, you'd want
        // to implement a confidence score or manual review)
        const match = matches[0];
        const success = await linkProductToDiscogs(product.id, match.id);
        
        if (success) {
          successCount++;
        } else {
          failedCount++;
        }
      } else {
        failedCount++;
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return { success: successCount, failed: failedCount };
  } catch (error) {
    console.error('Error in batch linking process:', error);
    return { success: successCount, failed: failedCount };
  }
} 