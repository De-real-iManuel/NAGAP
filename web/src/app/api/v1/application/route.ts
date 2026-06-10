import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateReferenceNumber } from '@/lib/utils';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Zod schema for application submission
const ApplicationSchema = z.object({
  farmerName: z.string().min(2, 'Full name is required'),
  farmerEmail: z.string().email('Valid email required'),
  farmerPhone: z.string().min(10, 'Valid phone number required'),
  stateOfResidence: z.string().min(1, 'State is required'),
  lga: z.string().min(1, 'LGA is required'),
  farmLocation: z.string().min(5, 'Farm location is required'),
  farmType: z.string().min(1, 'Farm type is required'),
  farmSizeHectares: z.number().positive().optional(),
  cropOrLivestockTypes: z.array(z.string()).optional(),
  yearsInOperation: z.number().int().min(0).optional(),
  annualRevenueNGN: z.number().min(0).optional(),
  grantProgram: z.string().min(1, 'Grant program is required'),
  requestedFundingAmountNGN: z.number().positive('Funding amount must be positive'),
  proposedProjectDescription: z.string().min(100, 'Description must be at least 100 characters'),
  hasBVN: z.boolean().optional(),
  hasCACRegistration: z.boolean().optional(),
  isMemberOfCooperative: z.boolean().optional(),
  hasLandDocument: z.boolean().optional(),
  isSmallholderFarmer: z.boolean().optional(),
  isYouthFarmer: z.boolean().optional(),
  isWomanFarmer: z.boolean().optional(),
  hasExistingLoanDefault: z.boolean().optional(),
  additionalNotes: z.string().optional(),
  documents: z.record(z.string()).optional(),
});

// In-memory store for demo (Backend integration: replace with Vercel Postgres)
// Backend integration point: import { getDb } from '@/lib/db';
// and use SQL queries
const applicationStore: Map<string, Record<string, unknown>> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ApplicationSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten() },
        { status: 422, headers: CORS_HEADERS }
      );
    }

    const data = validated.data;
    const applicationReference = generateReferenceNumber();
    const submittedAt = new Date().toISOString();

    const application = {
      ...data,
      applicationReference,
      status: 'under_review',
      submittedAt,
      updatedAt: submittedAt,
      adminNotes: null,
    };

    // Backend integration: INSERT INTO nagap_applications (...) VALUES (...)
    applicationStore.set(applicationReference, application);

    return NextResponse.json(
      {
        success: true,
        applicationReference,
        submittedAt,
        message: 'Application submitted successfully. You will be contacted within 10–15 working days.',
        farmerName: data.farmerName,
        grantProgram: data.grantProgram,
        status: 'under_review',
      },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (err) {
    console.error('[POST /api/v1/applications]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function GET(request: NextRequest) {
  // Backend integration: require admin auth header; query DB with filters
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const state = searchParams.get('state');

  let results = Array.from(applicationStore.values());

  if (status) results = results.filter((a) => (a as Record<string, unknown>).status === status);
  if (state) results = results.filter((a) => (a as Record<string, unknown>).stateOfResidence === state);

  return NextResponse.json(
    { applications: results, total: results.length },
    { status: 200, headers: CORS_HEADERS }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// Export store for use by other route handlers in same process
export { applicationStore };