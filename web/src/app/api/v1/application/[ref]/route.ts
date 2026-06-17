import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb, mapDbRowToApplication, fileStore } from '@/lib/db';

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

  // Try Postgres first
  const db = await getDb();
  if (db) {
    try {
      const result = await db`SELECT * FROM nagap_applications WHERE application_reference = ${ref} LIMIT 1`;
      if (result.rows.length > 0) {
        const application = mapDbRowToApplication(result.rows[0]);
        return NextResponse.json({ application }, { status: 200, headers: CORS_HEADERS });
      }
    } catch (dbErr) {
      console.warn('[DB] GET application detail failed, falling back:', dbErr);
    }
  }

  // Fallback: file store
  const application = fileStore.get(ref);
  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404, headers: CORS_HEADERS });
  }
  return NextResponse.json({ application }, { status: 200, headers: CORS_HEADERS });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;

  const body = await request.json();
  const validated = UpdateSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validated.error.flatten() },
      { status: 422, headers: CORS_HEADERS }
    );
  }

  const now = new Date().toISOString();

  // Update in Postgres if available
  const db = await getDb();
  let updatedInDb = false;
  if (db) {
    try {
      await db`
        UPDATE nagap_applications
        SET status = ${validated.data.status},
            admin_notes = ${validated.data.adminNotes ?? null},
            updated_at = NOW()
        WHERE application_reference = ${ref}
      `;
      updatedInDb = true;
    } catch (dbErr) {
      console.warn('[DB] PATCH update failed, using file store:', dbErr);
    }
  }

  // Always update file store so both stay in sync
  const existing = fileStore.get(ref) ?? { applicationReference: ref };
  const updated = {
    ...existing,
    status: validated.data.status,
    adminNotes: validated.data.adminNotes ?? (existing?.adminNotes ?? null),
    updatedAt: now,
  };
  fileStore.set(ref, updated as Record<string, unknown>);

  console.log(`[${updatedInDb ? 'DB' : 'FileStore'}] Updated application ${ref} → ${validated.data.status}`);

  return NextResponse.json({ success: true, application: updated }, { status: 200, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
