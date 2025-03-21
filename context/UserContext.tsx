'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { getSupabase } from '@/utils/supabaseClient';
import { User } from '@/utils/types';
import { useRouter } from 'next/navigation';
import { UserMetadata } from '@supabase/supabase-js';

interface AuthError {
  message: string;
}

interface SignInResult {
  success: boolean;
  error?: AuthError;
}

interface AuthUser extends User {
  isDemoUser?: boolean;
  isAuthUser?: boolean;
  user_metadata?: UserMetadata;
}

interface UserContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  error: null,
  signIn: async () => ({ success: false, error: { message: 'UserContext not initialized' } }),
  signOut: async () => {},
  signUp: async () => false,
  updateUserProfile: async () => false,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Debug loading issue
  const debugLoadingState = () => {
    console.log('--------------------------------');
    console.log(`DEBUG: UserContext loading state - isLoading: ${isLoading}`);
    console.log(`DEBUG: Current user: ${user ? JSON.stringify({...user, id: '[REDACTED]'}) : 'null'}`);
    console.log(`DEBUG: Auth error: ${error}`);
    console.log('--------------------------------');
  };

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = getSupabase();

  // Add a redirecting flag to prevent multiple redirects
  const [redirecting, setRedirecting] = useState(false);

  // Call debug function whenever loading state changes
  useEffect(() => {
    debugLoadingState();
  }, [isLoading, user, error]);

  // Add a safe redirect function to prevent multiple redirects
  const safeRedirect = (url: string) => {
    console.log(`[UserContext] Attempting to redirect to: ${url}`);
    
    // Prevent redirect loops - if already on the target URL, don't redirect again
    if (typeof window !== 'undefined' && window.location.pathname === url) {
      console.log(`[UserContext] Already at ${url}, skipping redirect`);
      return;
    }
    
    if (!redirecting) {
      setRedirecting(true);
      console.log(`[UserContext] Safely redirecting to: ${url}`);
      
      // Make sure we're in a browser context
      if (typeof window !== 'undefined') {
        try {
          // Force a direct location change to break out of any potential issues with Next.js router
          console.log(`[UserContext] Executing direct location change to ${url}`);
          window.location.href = url;
        } catch (error) {
          console.error('[UserContext] Error during redirection:', error);
          // Fallback if direct location change fails
          try {
            console.log('[UserContext] Attempting router navigation as fallback');
            router.push(url);
          } catch (routerError) {
            console.error('[UserContext] Router navigation failed:', routerError);
          }
        }
        
        // Reset the redirecting flag after a delay
        setTimeout(() => {
          console.log('[UserContext] Resetting redirecting flag');
          setRedirecting(false);
        }, 3000);
      }
    } else {
      console.log(`[UserContext] Redirect already in progress, skipping redirect to: ${url}`);
    }
  };

  // Update the loadSession function to better handle seller profiles
  const loadSession = async () => {
    // Check for browser environment before accessing localStorage
    const isBrowser = typeof window !== 'undefined';
    console.log('Loading session, browser environment:', isBrowser);
    
    console.log('DEBUG: Initial loading state:', isLoading);
    
    // Implement a timeout to prevent infinite loading state
    const sessionLoadTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('Session loading took too long, setting default state');
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout
    
    // Check if we have recent user info cached to use while loading the actual session
    if (isBrowser) {
      try {
        const cachedUserInfo = localStorage.getItem('userContextInfo');
        if (cachedUserInfo) {
          const { user: cachedUser, lastUpdated } = JSON.parse(cachedUserInfo);
          const isRecent = (Date.now() - lastUpdated) < 3600000; // Less than 1 hour old
          
          if (isRecent && cachedUser) {
            console.log('Using cached user info while session loads');
            setUser(cachedUser);
          }
        }
      } catch (e) {
        console.error('Error reading cached user info', e);
      }
    }
    
    // Check for demo login first
    if (isBrowser) {
      const demoUserJSON = localStorage.getItem('demoUser');
      const isDemoLogin = localStorage.getItem('isDemoLogin') === 'true';
      
      if (isDemoLogin && demoUserJSON) {
        try {
          const demoUser = JSON.parse(demoUserJSON);
          setUser(demoUser);
          setIsLoading(false);
          console.log('Restored demo login session:', demoUser);
          return;
        } catch (e) {
          console.error('Failed to parse demo user from localStorage', e);
          localStorage.removeItem('demoUser');
          localStorage.removeItem('isDemoLogin');
        }
      }
    }
    
    if (supabase) {
      console.log('Fetching session from Supabase');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        setError(sessionError.message);
        setIsLoading(false);
        console.log('DEBUG: Set loading to false due to session error');
        return;
      }

      if (!session) {
        console.log('No active session found');
        setIsLoading(false);
        console.log('DEBUG: Set loading to false due to no active session');
        return;
      }
      
      console.log('Session found, fetching user profile');
      // When retrieving user from database after getting session
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', session.user.id)
        .maybeSingle(); // Use maybeSingle instead of single
      
      if (userError) {
        console.error('Error fetching user profile:', userError);
        
        // Try by email as fallback
        const { data: emailUserData, error: emailUserError } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle(); // Use maybeSingle
        
        if (emailUserError) {
          console.error('Error fetching user by email:', emailUserError);
          setError(userError.message);
        } else if (emailUserData) {
          console.log('Found user by email:', emailUserData);
          
          // Try to update auth_id to match
          try {
            await supabase
              .from('users')
              .update({ auth_id: session.user.id })
              .eq('id', emailUserData.id);
              
            console.log('Updated auth_id to match current session');
          } catch (updateError) {
            console.error('Failed to update auth_id:', updateError);
          }
          
          // Process the user with seller profile check
          await processUserData(emailUserData, session);
        } else {
          // No user found by email either, create a new one
          await createNewUser(session);
        }
      } else if (userData) {
        await processUserData(userData, session);
      } else {
        // No user found with matching auth_id, create a new one
        await createNewUser(session);
      }
    } else {
      console.log('DEBUG: No Supabase client available');
      setIsLoading(false);
    }
    
    // Clean up the timeout
    return () => clearTimeout(sessionLoadTimeout);
  };
  
  // Helper function to process user data and check for seller profile
  const processUserData = async (userData: any, session: any) => {
    console.log('Processing user data:', userData);
    
    let fullUserData = { ...userData };
    
    // Determine if user is a seller based on is_seller flag or email pattern
    const isSeller = 
      userData.is_seller === true || 
      (userData.email && userData.email.includes('seller'));
    
    // Only check for seller profile if user is flagged as a seller and supabase client exists
    if (isSeller && supabase) {
      console.log('User appears to be a seller, checking for seller profile');
      
      try {
        const { data: sellerData, error: sellerError } = await supabase
          .from('seller_profiles')
          .select('*')
          .eq('user_id', userData.id)
          .maybeSingle(); // Use maybeSingle
        
        if (sellerError && !sellerError.message.includes('no rows')) {
          console.error('Error fetching seller profile:', sellerError);
        } else if (sellerData) {
          console.log('Found seller profile:', sellerData);
          (fullUserData as any).seller_profile = sellerData;
        } else {
          // No seller profile found, create a default one in memory
          console.log('No seller profile found, using default template');
          (fullUserData as any).seller_profile = {
            user_id: userData.id,
            store_name: `${userData.email?.split('@')[0] || 'New'}'s Store`,
            is_verified: false,
            rating: 0,
            created_at: new Date().toISOString()
          };
          
          // If we know the user is a seller (from is_seller flag), ensure that the flag is set
          if (!userData.is_seller && userData.email && userData.email.includes('seller') && supabase) {
            console.log('Updating is_seller flag to match email pattern');
            try {
              await supabase
                .from('users')
                .update({ is_seller: true })
                .eq('id', userData.id);
                
              fullUserData.is_seller = true;
            } catch (updateError) {
              console.error('Failed to update is_seller flag:', updateError);
            }
          }
          
          // We don't try to create the seller profile here - we'll do it on demand
          // when the user accesses a seller feature to avoid blocking login
        }
      } catch (error) {
        console.error('Exception in seller profile check:', error);
      }
    }
    
    // Set the processed user data
    setUser(fullUserData);
    setIsLoading(false);
  };
  
  // Helper function to create a new user
  const createNewUser = async (session: any) => {
    if (!supabase) {
      console.error('No Supabase client available');
      setError('Failed to initialize database connection');
      setIsLoading(false);
      return;
    }
    
    console.log('Creating new user record for:', session.user.email);
    
    // Check if the email suggests this is a seller
    const isSeller = session.user.email && session.user.email.includes('seller');
    
    try {
      // Create new user record
      const { data: newUserData, error: insertError } = await supabase
        .from('users')
        .insert({
          auth_id: session.user.id,
          email: session.user.email,
          username: session.user.email?.split('@')[0] || 'user',
          is_seller: isSeller, // Set based on email pattern
          created_at: new Date().toISOString(),
          join_date: new Date().toISOString(),
          last_login: new Date().toISOString()
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Failed to create user record:', insertError);
        
        // Check if this is a duplicate key error - the user might already exist
        if (insertError.code === '23505' && insertError.message.includes('email')) {
          console.log('User exists but with different ID. Attempting to fetch by email.');
          
          // Try to fetch by email
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();
          
          if (fetchError) {
            console.error('Error fetching existing user:', fetchError);
            setError('Failed to retrieve user profile');
            setIsLoading(false);
          } else if (existingUser) {
            console.log('Found user by email:', existingUser);
            
            // Try to update the auth_id
            try {
              await supabase
                .from('users')
                .update({ auth_id: session.user.id })
                .eq('id', existingUser.id);
                
              console.log('Updated auth_id to match current session');
            } catch (updateError) {
              console.error('Failed to update auth_id:', updateError);
            }
            
            // Process the existing user
            await processUserData(existingUser, session);
          } else {
            console.error('Could not find or create user');
            setError('Failed to create user profile');
            setIsLoading(false);
          }
        } else {
          setError('Failed to create user profile');
          setIsLoading(false);
        }
      } else if (newUserData) {
        console.log('Created new user record:', newUserData);
        
        // Process the new user data
        await processUserData(newUserData, session);
      }
    } catch (error) {
      console.error('Exception creating user:', error);
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  // Move the auth state change listener to its own useEffect at the top level
  useEffect(() => {
    if (!supabase) return;
    
    console.log('[UserContext] Setting up auth state change listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only set to loading if user is not already set, to prevent flickering
        const shouldSetLoading = !user || event === 'SIGNED_OUT';
        
        if (shouldSetLoading) {
          setIsLoading(true);
        }

        console.log(`[UserContext] Auth state change: ${event}, user already set: ${!!user}`);

        if (event === 'SIGNED_IN' && session) {
          // Get user profile without using joins
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user profile:', userError);
            setError(userError.message);
          } else if (userData) {
            // If we have the user data, try to fetch seller profile separately
            let fullUserData = { ...userData };
            
            // Check if user might be a seller
            if (userData.is_seller || (userData.email && userData.email.includes('seller'))) {
              const { data: sellerData, error: sellerError } = await supabase
                .from('seller_profiles')
                .select('*')
                .eq('user_id', userData.id)
                .single();
                
              if (!sellerError && sellerData) {
                console.log('[UserContext] Found seller profile on auth state change');
                (fullUserData as any).seller_profile = sellerData;
              }
            }
            
            setUser(fullUserData);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }

        if (shouldSetLoading) {
          setIsLoading(false);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log('[UserContext] Cleaning up auth state change listener');
      subscription?.unsubscribe();
    };
  }, [supabase, user]);

  // Also add the loadSession call in useEffect with proper dependencies
  useEffect(() => {
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, router]); // loadSession is defined in component, omitting from deps to avoid recreation

  // Modified signIn function with direct navigation approach
  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    if (!supabase) {
      return { success: false, error: { message: 'Supabase client not initialized' } };
    }

    setIsLoading(true);
    setError(null);
    console.log('[UserContext] Starting authentication process');

    try {
      console.log('[UserContext] Sending login request to API');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('[UserContext] API response received, status:', response.status);

      // Handle API errors
      if (!response.ok) {
        console.error('[UserContext] Login failed:', data.error);
        setIsLoading(false);
        return { success: false, error: { message: data.error || 'Login failed' } };
      }

      console.log('[UserContext] Login success, setting up user state');

      // Demo login handling
      if (data.isDemo && data.user) {
        console.log('[UserContext] Demo login detected');
        localStorage.setItem('demoUser', JSON.stringify(data.user));
        localStorage.setItem('isDemoLogin', 'true');
        setUser({ ...data.user, isDemoUser: true });
        setIsLoading(false);
        return { success: true };
      }

      // Regular auth login
      if (data.success && data.user) {
        console.log('[UserContext] Auth login successful');
        
        // Immediately set the user state to prevent flashes
        setUser(data.user);
        
        // Setup session if provided
        if (data.session) {
          try {
            // Set the Supabase session
            await supabase.auth.setSession({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token
            });
            console.log('[UserContext] Supabase session established');
            
            // Force a session refresh to ensure we have all the latest data
            const { data: sessionData } = await supabase.auth.getSession();
            console.log('[UserContext] Session refreshed:', sessionData.session ? 'valid' : 'invalid');
            
            // Make sure to fetch the full user data from the database using separate queries
            if (sessionData.session) {
              try {
                // Get user data first
                const { data: fullUserData, error: userDataError } = await supabase
                  .from('users')
                  .select('*')
                  .eq('email', email)
                  .single();
                  
                if (fullUserData && !userDataError) {
                  console.log('[UserContext] Retrieved full user data from database');
                  
                  // Then get seller profile if applicable
                  let userWithProfile = { ...fullUserData };
                  
                  // Check if this might be a seller account
                  if (fullUserData.is_seller || (email && email.includes('seller'))) {
                    const { data: sellerData, error: sellerError } = await supabase
                      .from('seller_profiles')
                      .select('*')
                      .eq('user_id', fullUserData.id)
                      .single();
                      
                    if (!sellerError && sellerData) {
                      console.log('[UserContext] Retrieved seller profile');
                      (userWithProfile as any).seller_profile = sellerData;
                    }
                  }
                  
                  // Update the user state with complete data
                  setUser(userWithProfile);
                }
              } catch (fetchError) {
                console.warn('[UserContext] Could not fetch detailed user data:', fetchError);
                // Continue anyway as we already have basic user data
              }
            }
            
            // Store user info in localStorage for faster recovery on page loads
            localStorage.setItem('userContextInfo', JSON.stringify({
              lastUpdated: Date.now(),
              user: data.user
            }));
          } catch (err) {
            console.error('[UserContext] Session setup error:', err);
            // Continue even if session setup fails - the login API already validated credentials
          }
        }
        
        setIsLoading(false);
        return { success: true };
      }

      // Fallback for unexpected response structure
      console.warn('[UserContext] Unexpected login response format');
      setIsLoading(false);
      return { success: data.success || false };
    } catch (error) {
      console.error('[UserContext] Login exception:', error);
      setIsLoading(false);
      setError('An unexpected error occurred');
      return { 
        success: false, 
        error: { message: error instanceof Error ? error.message : 'Unknown error' } 
      };
    }
  };

  // Sign up user
  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    if (!supabase) return false;

    setIsLoading(true);
    setError(null);

    try {
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return false;
      }

      if (!authData.user) {
        setError('Failed to create user account');
        return false;
      }

      // Then, create the profile in the users table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            auth_id: authData.user.id,
            email,
            username: userData.username || email.split('@')[0] || `user_${Date.now()}`,
            created_at: new Date().toISOString(),
            join_date: new Date().toISOString(), // Required in the database schema
            last_login: new Date().toISOString(), // Required in the database schema
            ...userData,
          },
        ]);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        console.log('Error details:', JSON.stringify(profileError, null, 2));
        setError(profileError.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Failed to sign up');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update signOut to handle demo mode
  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    // Remove demo user if exists
    if (user?.isDemoUser) {
      localStorage.removeItem('demoUser');
      localStorage.removeItem('isDemoLogin');
      setUser(null);
      router.push('/');
      return;
    }
    
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        return;
      }
    }
    
    setUser(null);
    router.push('/');
    setIsLoading(false);
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!supabase || !user) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select('*')
        .single();

      if (error) {
        setError(error.message);
        return false;
      }

      setUser(data);
      return true;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError('Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}; 