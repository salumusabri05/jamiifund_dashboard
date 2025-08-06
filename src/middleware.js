import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

export async function middleware(request) {
  try {
    // Get token from Authorization header or cookies
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Prepare the secret key
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    // Verify the token
    const { payload } = await jwtVerify(token, secret);
    
    // Continue to the requested page
    return NextResponse.next();
  } catch (error) {
    // Redirect to login on verification failure
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Specify which paths to run the middleware on
export const config = {
  matcher: ['/protected/:path*', '/api/protected/:path*'],
};

export async function createToken(payload) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')  // Token expires in 2 hours
    .sign(secret);
  
  return token;
}