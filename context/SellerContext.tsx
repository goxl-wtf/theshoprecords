"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserContext';
import { 
  fetchSellerProfileByUserId, 
  createSellerProfile,
  updateSellerProfile,
  fetchListingsBySeller,
  createListing,
  updateListing,
  deleteListing,
  updateListingStatus
} from '@/utils/marketplaceService';
import { SellerProfile, Listing, ListingStatus } from '@/utils/types';

interface SellerContextType {
  sellerProfile: SellerProfile | null;
  isLoading: boolean;
  error: string | null;
  listings: Listing[];
  isLoadingListings: boolean;
  isSeller: boolean;
  registerAsSeller: (storeInfo: { store_name: string; description?: string; contact_email?: string; logo_url?: string }) => Promise<boolean>;
  updateProfile: (updates: Partial<SellerProfile>) => Promise<boolean>;
  refreshListings: (status?: ListingStatus) => Promise<void>;
  addListing: (listing: Omit<Listing, 'id' | 'seller_id' | 'created_at' | 'updated_at' | 'images'>) => Promise<Listing | null>;
  editListing: (id: string, updates: Partial<Listing>) => Promise<boolean>;
  removeListing: (id: string) => Promise<boolean>;
  changeListing: (id: string, status: ListingStatus) => Promise<boolean>;
}

const SellerContext = createContext<SellerContextType | undefined>(undefined);

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (context === undefined) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
};

export const SellerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState<boolean>(false);

  // Check if the user is a seller
  const isSeller = Boolean(sellerProfile);

  // Fetch seller profile when user changes
  useEffect(() => {
    const loadSellerProfile = async () => {
      if (!user) {
        setSellerProfile(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const profile = await fetchSellerProfileByUserId(user.id);
        setSellerProfile(profile);
        
        // If they are a seller, load their listings
        if (profile) {
          await refreshListings();
        }
      } catch (err) {
        console.error('Error fetching seller profile:', err);
        setError('Failed to load seller profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadSellerProfile();
  }, [user]);

  // Register as a seller
  const registerAsSeller = async (storeInfo: { 
    store_name: string; 
    description?: string; 
    contact_email?: string;
    logo_url?: string;
  }) => {
    if (!user) {
      setError('You must be logged in to register as a seller');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const profile = await createSellerProfile({
        user_id: user.id,
        store_name: storeInfo.store_name,
        description: storeInfo.description || '',
        contact_email: storeInfo.contact_email || user.email,
        logo_url: storeInfo.logo_url,
        is_verified: false
      });

      if (profile) {
        setSellerProfile(profile);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error registering as seller:', err);
      setError('Failed to register as a seller');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update seller profile
  const updateProfile = async (updates: Partial<SellerProfile>) => {
    if (!sellerProfile) {
      setError('Seller profile not found');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedProfile = await updateSellerProfile(sellerProfile.id, updates);
      if (updatedProfile) {
        setSellerProfile(updatedProfile);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating seller profile:', err);
      setError('Failed to update seller profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh listings
  const refreshListings = async (status?: ListingStatus) => {
    if (!sellerProfile) return;

    setIsLoadingListings(true);
    
    try {
      const sellerListings = await fetchListingsBySeller(sellerProfile.id, status);
      setListings(sellerListings);
    } catch (err) {
      console.error('Error fetching seller listings:', err);
    } finally {
      setIsLoadingListings(false);
    }
  };

  // Add a new listing
  const addListing = async (listing: Omit<Listing, 'id' | 'seller_id' | 'created_at' | 'updated_at' | 'images'>) => {
    if (!sellerProfile) {
      setError('You must be a registered seller to create listings');
      return null;
    }

    try {
      const newListing = await createListing({
        ...listing,
        seller_id: sellerProfile.id
      });

      if (newListing) {
        setListings(prev => [...prev, newListing]);
        return newListing;
      }
      return null;
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing');
      return null;
    }
  };

  // Edit a listing
  const editListing = async (id: string, updates: Partial<Listing>) => {
    try {
      const updatedListing = await updateListing(id, updates);
      
      if (updatedListing) {
        setListings(prev => 
          prev.map(listing => listing.id === id ? updatedListing : listing)
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating listing:', err);
      setError('Failed to update listing');
      return false;
    }
  };

  // Remove a listing
  const removeListing = async (id: string) => {
    try {
      const success = await deleteListing(id);
      
      if (success) {
        setListings(prev => prev.filter(listing => listing.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError('Failed to delete listing');
      return false;
    }
  };

  // Change listing status
  const changeListing = async (id: string, status: ListingStatus) => {
    try {
      const success = await updateListingStatus(id, status);
      
      if (success) {
        setListings(prev => 
          prev.map(listing => listing.id === id ? {...listing, status} : listing)
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating listing status:', err);
      setError('Failed to update listing status');
      return false;
    }
  };

  const value = {
    sellerProfile,
    isLoading,
    error,
    listings,
    isLoadingListings,
    isSeller,
    registerAsSeller,
    updateProfile,
    refreshListings,
    addListing,
    editListing,
    removeListing,
    changeListing
  };

  return (
    <SellerContext.Provider value={value}>
      {children}
    </SellerContext.Provider>
  );
}; 