/**
 * Vercel Postgres client and schema initialization for NAGAP portal
 * Backend integration point: replace mock responses with real DB calls
 */

// NOTE: This file uses @vercel/postgres for production DB access.
// For local development without a Postgres connection, the API routes
// fall back to in-memory mock data.

let sql: ((strings: TemplateStringsArray, ...values: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>) | null = null;

async function getDb() {
  if (sql) return sql;
  try {
    const { sql: pgSql } = await import('@vercel/postgres');
    sql = pgSql as typeof sql;
    return sql;
  } catch {
    return null;
  }
}

export async function initializeSchema(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  // Backend integration: run once on first deploy or via migration
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
      has_existing_loan_default   BOOLEAN DEFAULT FALSE,
      additional_notes            TEXT,
      documents                   JSONB DEFAULT '{}',
      status                      VARCHAR(50) DEFAULT 'under_review',
      admin_notes                 TEXT,
      submitted_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
}

export { getDb };