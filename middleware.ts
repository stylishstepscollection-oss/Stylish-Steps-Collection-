import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  const hostname = req.headers.get('host') || '';
  const isAdminSubdomain = hostname.startsWith('admin.');
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // ========================================
  // ADMIN SUBDOMAIN HANDLING
  // ========================================
  if (isAdminSubdomain) {
    console.log(`[ADMIN SUBDOMAIN] ${pathname}`); // Fixed syntax
    
    // Redirect /admin paths to root paths on admin subdomain
    if (pathname.startsWith('/admin')) {
      const newPath = pathname.replace(/^\/admin/, '') || '/dashboard';
      console.log(`[ADMIN SUBDOMAIN] Redirecting /admin${pathname} to ${newPath}`); // Fixed syntax
      return NextResponse.redirect(new URL(newPath, req.url));
    }
    
    // Admin login page - accessible without auth
    if (pathname === '/admin-login') {
      if (token?.role === 'admin') {
        console.log('[ADMIN SUBDOMAIN] Admin logged in, redirecting to /dashboard');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      console.log('[ADMIN SUBDOMAIN] Allowing access to /admin-login');
      return NextResponse.next();
    }
    
    // Root path - redirect appropriately
    if (pathname === '/') {
      if (token?.role === 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/admin-login', req.url)); // Changed from /login
    }
    
if (!token || token.role !== 'admin') {
  console.log(`[ADMIN SUBDOMAIN] Access denied - Role: ${token?.role || 'none'}`);
  return NextResponse.redirect(new URL('/admin-login', req.url));
}    
    console.log('[ADMIN SUBDOMAIN] Admin authenticated, allowing access');
    return NextResponse.next();
  }
  
  // ========================================
  // MAIN DOMAIN HANDLING
  // ========================================
  console.log(`[MAIN DOMAIN] ${pathname}`); // Fixed syntax
  
  // Block any admin-related paths on main domain
  if (pathname.startsWith('/admin') || pathname === '/dashboard') {
    console.log('[MAIN DOMAIN] Blocked admin path');
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  // Public auth routes
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }
  
  // Protected user routes
  const protectedRoutes = ['/profile', '/orders', '/wishlist'];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).)*',
  ],
};