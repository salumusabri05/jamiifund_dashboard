import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '../../../../lib/auth-utils';
import { adminSupabase } from '../../../../lib/supabaseClient';

export async function GET() {
  try {
    // Get token from cookie
    const token = cookies().get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
    const payload = verifyJWT(token, JWT_SECRET);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Get admin data from database
    const { data: admin, error } = await adminSupabase
      .from('admins')
      .select('id, email, full_name, role, created_at, last_login, is_active, avatar_url')
      .eq('id', payload.sub)
      .eq('is_active', true)
      .single();
    
    if (error || !admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ admin });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Session verification failed' },
      { status: 500 }
    );
  }
}