// Discogs API integration service

import { Product, Track, Image, Genre, Style } from './types';

// Interfaces for Discogs API responses
export interface DiscogsSearchResult {
  pagination: {
    page: number;
    pages: number;
    items: number;
    per_page: number;
  };
  results: {
    id: number;
    title: string;
    year: string;
    country: string;
    format: string[];
    label: string[];
    genre: string[];
    style: string[];
    type: string;
    cover_image: string;
    thumb: string;
    resource_url: string;
  }[];
}

export interface DiscogsReleaseDetails {
  id: number;
  title: string;
  artists: {
    name: string;
    id: number;
    resource_url: string;
  }[];
  year: number;
  country: string;
  formats: {
    name: string;
    qty: string;
    descriptions?: string[];
  }[];
  genres: string[];
  styles: string[];
  tracklist: {
    position: string;
    title: string;
    duration: string;
  }[];
  images: {
    type: string;
    uri: string;
    resource_url: string;
    uri150: string;
    width: number;
    height: number;
  }[];
  videos?: {
    uri: string;
    title: string;
  }[];
  community?: {
    want: number;
    have: number;
  };
  estimated_weight?: number;
  format_quantity: number;
  lowest_price?: number;
  num_for_sale?: number;
}

export interface DiscogsError {
  message: string;
  status: number;
}

// API endpoint - now using our Next.js API route
const DISCOGS_API_ENDPOINT = '/api/discogs';

// Function to search releases on Discogs
export async function searchReleases(
  query: string,
  page: number = 1,
  per_page: number = 20
): Promise<DiscogsSearchResult | DiscogsError> {
  try {
    const response = await fetch(
      `${DISCOGS_API_ENDPOINT}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}&type=release`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        message: errorData.message || 'Error searching Discogs',
        status: response.status
      };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching Discogs:', error);
    return {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
  }
}

// Function to get release details by ID
export async function getReleaseDetails(
  releaseId: number
): Promise<DiscogsReleaseDetails | DiscogsError> {
  try {
    const response = await fetch(`${DISCOGS_API_ENDPOINT}/releases/${releaseId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        message: errorData.message || 'Error fetching release details',
        status: response.status
      };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching release details:', error);
    return {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
  }
}

// Function to get marketplace price suggestions for a release
export async function getPriceSuggestions(
  releaseId: number,
  condition: string
): Promise<{ price: number; currency: string } | DiscogsError> {
  try {
    const response = await fetch(
      `${DISCOGS_API_ENDPOINT}/marketplace/price-suggestions/${releaseId}?condition=${condition}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        message: errorData.message || 'Error fetching price suggestions',
        status: response.status
      };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching price suggestions:', error);
    return {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
  }
}

// Helper function to convert Discogs release to our Product format
export function convertDiscogsToProduct(release: DiscogsReleaseDetails): Partial<Product> {
  // Extract artist from title or artists array
  const artist = release.artists?.length 
    ? release.artists.map(a => a.name).join(', ') 
    : release.title.split(' - ')[0] || 'Unknown Artist';
  
  // Extract album title from the release title
  const albumTitle = release.artists?.length 
    ? release.title 
    : release.title.includes(' - ') 
      ? release.title.split(' - ')[1] 
      : release.title;
  
  // Format the description
  const description = `${albumTitle} by ${artist}, released in ${release.year || 'Unknown Year'} in ${release.country || 'Unknown Country'}. Format: ${release.formats.map(f => f.name).join(', ')}`;
  
  // Convert tracks
  const tracks: Track[] = release.tracklist.map((track, index) => ({
    id: `temp-${release.id}-track-${index}`,
    product_id: `temp-${release.id}`,
    title: track.title,
    position: parseInt(track.position) || index + 1,
    duration: track.duration || '0:00',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  
  // Convert images
  const images: Image[] = release.images.map((image, index) => ({
    id: `temp-${release.id}-image-${index}`,
    product_id: `temp-${release.id}`,
    url: image.uri,
    width: image.width,
    height: image.height,
    position: index,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  
  // Convert genres
  const genres: Genre[] = release.genres.map((genreName, index) => ({
    id: `temp-genre-${index}`,
    name: genreName,
    slug: genreName.toLowerCase().replace(/\s+/g, '-'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  
  // Convert styles
  const styles: Style[] = release.styles.map((styleName, index) => ({
    id: `temp-style-${index}`,
    name: styleName,
    slug: styleName.toLowerCase().replace(/\s+/g, '-'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  
  // Create a partial product
  return {
    title: albumTitle,
    artist,
    description,
    price: release.lowest_price || 19.99,
    year: release.year || undefined,
    images,
    tracks,
    genres,
    styles
  };
} 