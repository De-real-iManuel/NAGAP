import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const CheckStatusSchema = z.object({
  referenceNumber: z.string().min(1, 'Reference number is required'),
  farmerEmail: z.string().email('Valid email required'),
});

// Mock data for status check demo
const mockApplications: Record<string, Record<string, unknown>> = {
  'NAGAP-A3K8M2': {
    applicationReference: 'NAGAP-A3K8M2',
    farmerName: 'Adaeze Okonkwo',
    farmerEmail: 'adaeze.okonkwo@gmail.com',
    stateOfResidence: 'Enugu',
    grantProgram: 'CBN Anchor Borrowers Programme',
    requestedFundingAmountNGN: 2500000,
    status: 'document_verification',
    submittedAt: '2026-05-14T09:22:00.000Z',
    updatedAt: '2026-05-20T14:10:00.000Z',
    adminNotes: 'Documents received. Under verification.',
  },
  'NAGAP-B7X9P4': {
    applicationReference: 'NAGAP-B7X9P4',
    farmerName: 'Emeka Nwosu',
    farmerEmail: 'emeka.nwosu@yahoo.com',
    stateOfResidence: 'Anambra',
    grantProgram: 'NIRSAL AGSMEIS',
    requestedFundingAmountNGN: 5000000,
    status: 'approved',
    submittedAt: '2026-04-28T11:05:00.000Z',
    updatedAt: '2026-05-25T09:30:00.000Z',
    adminNotes: 'All documents verified. Disbursement scheduled.',
  },
};

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

    // Backend integration: SELECT * FROM nagap_applications WHERE application_reference = $1 AND farmer_email = $2
    const application = mockApplications[referenceNumber];

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
    console.error('[POST /api/v1/applications/check-status]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}