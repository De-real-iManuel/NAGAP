import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateReferenceNumber } from '@/lib/utils';
import { getDb, initializeSchema, mapDbRowToApplication, fileStore } from '@/lib/db';

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
  hasNoLoanDefault: z.boolean().optional(),
  additionalNotes: z.string().optional(),
  documents: z.record(z.string(), z.any()).optional(),
});

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

    // Try to save to Postgres if available
    const db = await getDb();
    if (db) {
      try {
        await initializeSchema();
        await db`
          INSERT INTO nagap_applications (
            application_reference,
            farmer_name,
            farmer_email,
            farmer_phone,
            state_of_residence,
            lga,
            farm_location,
            farm_type,
            farm_size_hectares,
            crop_or_livestock_types,
            years_in_operation,
            annual_revenue_ngn,
            grant_program,
            requested_funding_amount_ngn,
            proposed_project_description,
            has_bvn,
            has_cac_registration,
            is_member_of_cooperative,
            has_land_document,
            is_smallholder_farmer,
            is_youth_farmer,
            is_woman_farmer,
            has_no_loan_default,
            additional_notes,
            documents,
            status,
            submitted_at,
            updated_at
          ) VALUES (
            ${applicationReference},
            ${data.farmerName},
            ${data.farmerEmail},
            ${data.farmerPhone},
            ${data.stateOfResidence},
            ${data.lga},
            ${data.farmLocation},
            ${data.farmType},
            ${data.farmSizeHectares ?? null},
            ${data.cropOrLivestockTypes ?? []},
            ${data.yearsInOperation ?? null},
            ${data.annualRevenueNGN ?? null},
            ${data.grantProgram},
            ${data.requestedFundingAmountNGN},
            ${data.proposedProjectDescription},
            ${data.hasBVN ?? false},
            ${data.hasCACRegistration ?? false},
            ${data.isMemberOfCooperative ?? false},
            ${data.hasLandDocument ?? false},
            ${data.isSmallholderFarmer ?? false},
            ${data.isYouthFarmer ?? false},
            ${data.isWomanFarmer ?? false},
            ${data.hasNoLoanDefault ?? true},
            ${data.additionalNotes ?? null},
            ${JSON.stringify(data.documents ?? {})},
            'under_review',
            NOW(),
            NOW()
          );
        `;
        console.log(`[DB] Saved application ${applicationReference} to Postgres`);
      } catch (dbErr) {
        console.error('[DB] Postgres write failed, saving to file store:', dbErr);
        // Fall through to file store
        fileStore.set(applicationReference, application as Record<string, unknown>);
      }
    } else {
      // No Postgres — persist to file store
      fileStore.set(applicationReference, application as Record<string, unknown>);
      console.log(`[FileStore] Saved application ${applicationReference}`);
    }

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
    console.error('[POST /api/v1/application]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const state = searchParams.get('state');

  // Try Postgres first
  const db = await getDb();
  if (db) {
    try {
      await initializeSchema();
      const result = await db`SELECT * FROM nagap_applications ORDER BY submitted_at DESC`;
      let applications = result.rows.map(mapDbRowToApplication);

      if (status) applications = applications.filter((a) => a.status === status);
      if (state) applications = applications.filter((a) => a.stateOfResidence === state);

      return NextResponse.json(
        { applications, total: applications.length },
        { status: 200, headers: CORS_HEADERS }
      );
    } catch (dbErr) {
      console.warn('[DB] Postgres GET failed, using file store:', dbErr);
    }
  }

  // Fallback: file store
  let results = fileStore.getAll() as Record<string, unknown>[];
  if (status) results = results.filter((a) => a.status === status);
  if (state) results = results.filter((a) => a.stateOfResidence === state);
  // Sort newest first
  results.sort((a, b) => {
    const aTime = a.submittedAt ? new Date(a.submittedAt as string).getTime() : 0;
    const bTime = b.submittedAt ? new Date(b.submittedAt as string).getTime() : 0;
    return bTime - aTime;
  });

  return NextResponse.json(
    { applications: results, total: results.length },
    { status: 200, headers: CORS_HEADERS }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}