import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminSupabase } from '../../../../lib/supabaseClient';
import { verifyPassword, generateJWT } from '../../../../lib/auth-utils';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Fetch admin by email (using service role for direct table access)
    const { data: admin, error } = await adminSupabase
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = verifyPassword(password, admin.password_hash, admin.salt);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login timestamp
    await adminSupabase
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // Create a JWT token (use a secure secret in production)
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
    const token = generateJWT(
      { 
        sub: admin.id,
        email: admin.email,
        role: admin.role,
        name: admin.full_name
      }, 
      JWT_SECRET,
      // 24 hour expiration
      24 * 60 * 60 
    );

    // Set secure HTTP-only cookie with the token
    cookies().set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    // Return admin data (exclude sensitive fields)
    const { password_hash, salt, reset_token, reset_token_expires, ...safeAdminData } = admin;
    
    return NextResponse.json({
      message: 'Login successful',
      admin: safeAdminData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}