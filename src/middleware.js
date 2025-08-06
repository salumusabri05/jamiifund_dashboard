import { NextResponse } from 'next/server';
import { verifyJWT } from './lib/auth-utils';

export function middleware(request) {
  // Get token from cookie
  const token = request.cookies.get('admin_token')?.value;
  
  // Define protected paths
  const isProtectedPath = request.nextUrl.pathname.startsWith('/admin') || 
                         request.nextUrl.pathname === '/Home';
  
  // Login path - redirect to dashboard if already logged in
  if (request.nextUrl.pathname === '/login') {
    if (token) {
      // Verify token
      const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
      const payload = verifyJWT(token, JWT_SECRET);
      
      if (payload) {
        return NextResponse.redirect(new URL('/Home', request.url));
      }
    }
    return NextResponse.next();
  }
  
  // Protected paths - verify token
  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
    const payload = verifyJWT(token, JWT_SECRET);
    
    if (!payload) {
      // Clear invalid token
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set({
        name: 'admin_token',
        value: '',
        httpOnly: true,
        maxAge: 0,
        path: '/',
      });
      return response;
    }
  }
  
  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: ['/login', '/Home', '/admin/:path*'],
};