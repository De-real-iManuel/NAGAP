import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { applicationStore } from '../route';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const UpdateSchema = z.object({
  status: z.enum(['under_review', 'document_verification', 'approved', 'rejected', 'additional_info_required']),
  adminNotes: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const application = applicationStore.get(ref);
  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404, headers: CORS_HEADERS });
  }
  return NextResponse.json({ application }, { status: 200, headers: CORS_HEADERS });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const application = applicationStore.get(ref);
  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404, headers: CORS_HEADERS });
  }

  const body = await request.json();
  const validated = UpdateSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json({ error: 'Validation failed', details: validated.error.flatten() }, { status: 422, headers: CORS_HEADERS });
  }

  const updated = {
    ...application,
    status: validated.data.status,
    adminNotes: validated.data.adminNotes ?? application.adminNotes,
    updatedAt: new Date().toISOString(),
  };

  applicationStore.set(ref, updated);
  return NextResponse.json({ success: true, application: updated }, { status: 200, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
