import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('nagap_admin_session');

    if (session && session.value === 'logged_in_valid_token_2026') {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false });
  } catch (err) {
    console.error('[GET /api/v1/admin/status]', err);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
