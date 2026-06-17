import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'NagapAdmin2026!';

    if (username === adminUser && password === adminPass) {
      const response = NextResponse.json({ success: true });
      const cookieStore = await cookies();
      cookieStore.set('nagap_admin_session', 'logged_in_valid_token_2026', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 2, // 2 hours
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  } catch (err) {
    console.error('[POST /api/v1/admin/login]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
