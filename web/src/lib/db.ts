/**
 * NAGAP Database Layer
 * - Uses Vercel Postgres when POSTGRES_URL is set (production)
 * - Falls back to a persistent JSON file store for local development
 *   so data survives server restarts and hot-reloads
 */

import path from 'path';
import fs from 'fs';

// ─────────────────────────────────────────────────────────────────────────────
// File-based JSON store (local dev fallback)
// ─────────────────────────────────────────────────────────────────────────────

const DATA_FILE = path.join(process.cwd(), 'data', 'applications.json');

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readStore(): Record<string, Record<string, unknown>> {
  ensureDataDir();
  try {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, Record<string, unknown>>) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

export const fileStore = {
  get(ref: string) {
    return readStore()[ref] ?? null;
  },
  set(ref: string, data: Record<string, unknown>) {
    const store = readStore();
    store[ref] = data;
    writeStore(store);
  },
  getAll(): Record<string, unknown>[] {
    return Object.values(readStore());
  },
  delete(ref: string) {
    const store = readStore();
    delete store[ref];
    writeStore(store);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Vercel Postgres client
// ─────────────────────────────────────────────────────────────────────────────

let sql: ((strings: TemplateStringsArray, ...values: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>) | null = null;

async function getDb() {
  if (!process.env.POSTGRES_URL) return null;
  if (sql) return sql;
  try {
    const { sql: pgSql } = await import('@vercel/postgres');
    sql = pgSql as typeof sql;
    return sql;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Schema initialization (Postgres only)
// ─────────────────────────────────────────────────────────────────────────────

export async function initializeSchema(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db`
    CREATE TABLE IF NOT EXISTS nagap_applications (
      id                          SERIAL PRIMARY KEY,
      application_reference       VARCHAR(20) UNIQUE NOT NULL,
      farmer_name                 VARCHAR(255) NOT NULL,
      farmer_email                VARCHAR(255) NOT NULL,
      farmer_phone                VARCHAR(30) NOT NULL,
      state_of_residence          VARCHAR(100) NOT NULL,
      lga                         VARCHAR(100) NOT NULL,
      farm_location               TEXT NOT NULL,
      farm_type                   VARCHAR(100) NOT NULL,
      farm_size_hectares          DECIMAL(10,2),
      crop_or_livestock_types     TEXT[],
      years_in_operation          INTEGER,
      annual_revenue_ngn          BIGINT,
      grant_program               VARCHAR(255) NOT NULL,
      requested_funding_amount_ngn BIGINT NOT NULL,
      proposed_project_description TEXT NOT NULL,
      has_bvn                     BOOLEAN DEFAULT FALSE,
      has_cac_registration        BOOLEAN DEFAULT FALSE,
      is_member_of_cooperative    BOOLEAN DEFAULT FALSE,
      has_land_document           BOOLEAN DEFAULT FALSE,
      is_smallholder_farmer       BOOLEAN DEFAULT FALSE,
      is_youth_farmer             BOOLEAN DEFAULT FALSE,
      is_woman_farmer             BOOLEAN DEFAULT FALSE,
      has_no_loan_default         BOOLEAN DEFAULT TRUE,
      additional_notes            TEXT,
      documents                   JSONB DEFAULT '{}',
      status                      VARCHAR(50) DEFAULT 'under_review',
      admin_notes                 TEXT,
      submitted_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Row mapper (Postgres → Application object)
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbRowToApplication(row: any) {
  return {
    applicationReference: row.application_reference,
    farmerName: row.farmer_name,
    farmerEmail: row.farmer_email,
    farmerPhone: row.farmer_phone,
    stateOfResidence: row.state_of_residence,
    lga: row.lga,
    farmLocation: row.farm_location,
    farmType: row.farm_type,
    farmSizeHectares: row.farm_size_hectares ? Number(row.farm_size_hectares) : undefined,
    cropOrLivestockTypes: row.crop_or_livestock_types,
    yearsInOperation: row.years_in_operation,
    annualRevenueNGN: row.annual_revenue_ngn ? Number(row.annual_revenue_ngn) : undefined,
    grantProgram: row.grant_program,
    requestedFundingAmountNGN: row.requested_funding_amount_ngn ? Number(row.requested_funding_amount_ngn) : 0,
    proposedProjectDescription: row.proposed_project_description,
    hasBVN: row.has_bvn,
    hasCACRegistration: row.has_cac_registration,
    isMemberOfCooperative: row.is_member_of_cooperative,
    hasLandDocument: row.has_land_document,
    isSmallholderFarmer: row.is_smallholder_farmer,
    isYouthFarmer: row.is_youth_farmer,
    isWomanFarmer: row.is_woman_farmer,
    hasNoLoanDefault: row.has_no_loan_default ?? true,
    additionalNotes: row.additional_notes,
    documents: typeof row.documents === 'string' ? JSON.parse(row.documents) : (row.documents ?? {}),
    status: row.status,
    adminNotes: row.admin_notes,
    submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

export { getDb };