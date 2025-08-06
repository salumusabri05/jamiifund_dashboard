import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get token from cookie
  const token = request.cookies.get('admin_token')?.value;
  
  // Define protected paths
  const isProtectedPath = request.nextUrl.pathname.startsWith('/admin') || 
                         request.nextUrl.pathname === '/Home';
  
  // Login path - redirect to dashboard if already logged in
  if (request.nextUrl.pathname === '/login') {
    if (token) {
      // For now, just check if token exists
      // In production, you would verify the token here
      return NextResponse.redirect(new URL('/Home', request.url));
    }
    return NextResponse.next();
  }
  
  // Protected paths - verify token
  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // For now, just check if token exists
    // In production, you would verify the token here
  }
  
  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: ['/login', '/Home', '/admin/:path*'],
};