import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb, mapDbRowToApplication, fileStore } from '@/lib/db';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const CheckStatusSchema = z.object({
  referenceNumber: z.string().min(1, 'Reference number is required'),
  farmerEmail: z.string().email('Valid email required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CheckStatusSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten() },
        { status: 422, headers: CORS_HEADERS }
      );
    }

    const { referenceNumber, farmerEmail } = validated.data;

    // 1. Try Postgres first
    const db = await getDb();
    if (db) {
      try {
        const result = await db`
          SELECT * FROM nagap_applications 
          WHERE application_reference = ${referenceNumber} AND farmer_email = ${farmerEmail}
          LIMIT 1
        `;
        if (result.rows.length > 0) {
          const application = mapDbRowToApplication(result.rows[0]);
          return NextResponse.json(
            { found: true, application },
            { status: 200, headers: CORS_HEADERS }
          );
        }
        // Not found in DB
        return NextResponse.json(
          { error: 'No application found with that reference number and email combination.' },
          { status: 404, headers: CORS_HEADERS }
        );
      } catch (dbErr) {
        console.warn('[DB] check-status failed, falling back to file store:', dbErr);
      }
    }

    // 2. Fall back to file store
    const application = fileStore.get(referenceNumber);

    if (!application || application.farmerEmail !== farmerEmail) {
      return NextResponse.json(
        { error: 'No application found with that reference number and email combination.' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { found: true, application },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err) {
    console.error('[POST /api/v1/application/check-status]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}