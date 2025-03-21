import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard', 
  '/user/orders', 
  '/user/profile',
];

// Routes that should redirect authenticated users (like login/register)
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/login',
];

export async function middleware(request: NextRequest) {
  // Get the pathname and search params
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();
  
  // Create a response with the NextResponse API
  const response = NextResponse.next();

  try {
    // Create a Supabase client using the cookies from the request
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name, options) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Check auth status
    const { data: { session } } = await supabase.auth.getSession();
    const isAuthenticated = !!session;
    
    // Check if the route requires authentication
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );
    
    // Check if this is an auth route (login, register, etc.)
    const isAuthRoute = AUTH_ROUTES.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    // Simple routing logic:
    // 1. If trying to access protected route without auth, redirect to login
    if (isProtectedRoute && !isAuthenticated) {
      console.log(`[Middleware] Access to protected route ${pathname} without authentication`);
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // 2. If trying to access auth route while authenticated, redirect to dashboard
    if (isAuthRoute && isAuthenticated) {
      console.log(`[Middleware] Already authenticated user is trying to access ${pathname}`);
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Otherwise, continue with the request
    return response;
  } catch (error) {
    console.error('[Middleware] Auth verification error:', error);
    // On error, allow the request to proceed
    return response;
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Match all protected routes
    '/dashboard/:path*',
    '/user/:path*',
    // Match auth routes
    '/auth/:path*',
    '/login',
  ],
}; 