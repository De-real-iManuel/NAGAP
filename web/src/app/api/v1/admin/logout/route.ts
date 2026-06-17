import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('nagap_admin_session');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/v1/admin/logout]', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
