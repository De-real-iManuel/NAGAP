# NAGAP — Nigerian Agricultural Grant Application Portal

**Official digital submission portal for Nigerian agricultural grant programmes**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](LICENSE)

---

## Overview

NAGAP is the farmer-facing web application through which Nigerian farmers, cooperatives, and agribusinesses submit grant applications to government agricultural financing programmes. It provides a formal, government-style interface that handles the complete application lifecycle — from initial submission through administrative review to final approval or rejection — while serving as the integration point for the AgriGrant AI pipeline.

NAGAP is one half of the AgriGrant AI system. The other half — the five-agent AI pipeline built on UiPath Agentic Automation — handles grant discovery, eligibility scoring, document validation, letter generation, and submission guidance. When a farmer submits through NAGAP, their application reference and profile data are passed to the AgriGrant AI pipeline, which processes the application and returns results via email through SendGrid.

---

## What This Repository Contains

This repository contains the `web/` directory of the broader AgriGrant AI project. It is a standalone Next.js application with its own API layer, styling system, and admin interface.

```
NAGAP/
└── web/                        ← This repository
    ├── src/
    │   ├── app/
    │   │   ├── admin/          ← Internal admin dashboard
    │   │   ├── api/v1/         ← REST API route handlers
    │   │   ├── components/     ← Landing page sections
    │   │   ├── grant-application-form/   ← Five-section application form
    │   │   ├── status/         ← Public application status checker
    │   │   ├── success-confirmation-p/   ← Post-submission confirmation
    │   │   ├── layout.tsx
    │   │   ├── not-found.tsx
    │   │   └── page.tsx        ← Landing page
    │   ├── components/
    │   │   ├── Header.tsx      ← Government-style header with nav and notice ticker
    │   │   ├── Footer.tsx
    │   │   └── ui/
    │   │       ├── AppIcon.tsx     ← Heroicons wrapper
    │   │       ├── AppLogo.tsx     ← NAGAP logo component
    │   │       └── AppImage.tsx    ← Next/Image wrapper
    │   ├── lib/
    │   │   ├── db.ts           ← Vercel Postgres client and schema
    │   │   └── utils.ts        ← Shared helpers, constants, Nigerian states/programmes
    │   └── styles/
    │       └── tailwind.css    ← Global styles, CSS variables, component classes
    └── public/
        ├── fonts/              ← Plus Jakarta Sans (offline, variable font)
        └── assets/images/      ← Logo and static assets
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with active grant programmes, official notice board, portal statistics, and about section |
| `/grant-application-form` | Five-section application form covering personal info, farm profile, grant request, compliance checklist, and document upload |
| `/status` | Public status checker — applicants enter their reference number and email to view application status |
| `/success-confirmation-p` | Post-submission confirmation page with reference number, acknowledgement receipt download, and next-steps timeline |
| `/admin` | Internal admin dashboard for reviewing, approving, and exporting applications |

---

## Application Form

The grant application form is divided into five sections, each with inline validation:

| Section | Fields |
|---------|--------|
| 1 — Personal & Farm Information | Full legal name, email, phone, state of residence, LGA, farm address |
| 2 — Farm Profile | Farm type, size in hectares, years in operation, annual revenue, crops and livestock |
| 3 — Grant Request | Programme selection, requested funding amount, proposed project description (min. 100 characters) |
| 4 — Compliance Checklist | BVN, CAC registration, cooperative membership, land document, smallholder / youth / woman farmer flags, existing loan default declaration |
| 5 — Document Upload & Declaration | NIN slip, CAC certificate, bank statement (6 months), land document, statutory declaration |

On successful submission, a `NAGAP-XXXXXX` reference number is generated and the submission data is stored. The farmer is redirected to the confirmation page and a confirmation email is dispatched via the AgriGrant API.

---

## Admin Dashboard

The `/admin` route provides internal staff with complete visibility and control over submitted applications.

| Feature | Description |
|---------|-------------|
| Stats Cards | Total applications, per-status counts (Under Review, Doc Verification, Approved, Rejected, More Info), total requested value, approval rate |
| Applications Table | Paginated table sortable by applicant name, state, requested amount, and submission date |
| Filters | Filter simultaneously by status, state of residence, and grant programme |
| Search | Full-text search across applicant name, reference number, and email address |
| Quick Actions | One-click approve or reject directly from the table row with a confirmation prompt |
| Detail Modal | Full applicant profile including farm details, compliance flags, uploaded document names, and admin notes |
| Status Updates | Update application status with admin notes: Under Review → Document Verification → Approved / Rejected / Additional Info Required |
| CSV Export | Export the current filtered and sorted view as a downloadable CSV file |

---

## API Reference

All endpoints are under `/api/v1`. The application currently uses in-memory storage for development. In production, all routes are designed to connect to Vercel Postgres — the schema is defined in `src/lib/db.ts`.

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/application` | None | Submit a new grant application |
| `GET` | `/api/v1/application` | Admin | List all applications with optional `?status=` and `?state=` filters |
| `GET` | `/api/v1/application/[ref]` | Admin | Retrieve a single application by reference number |
| `PATCH` | `/api/v1/application/[ref]` | Admin | Update application status and admin notes |
| `POST` | `/api/v1/application/check-status` | None | Public status check by reference number and email |
| `GET` | `/api/v1/health` | None | Health check |

### POST `/api/v1/application` — Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `farmerName` | string | Yes | Full legal name |
| `farmerEmail` | string | Yes | Email address |
| `farmerPhone` | string | Yes | Nigerian mobile number |
| `stateOfResidence` | string | Yes | State where farm is located |
| `lga` | string | Yes | Local Government Area |
| `farmLocation` | string | Yes | Full farm address |
| `farmType` | string | Yes | crop / livestock / poultry / fishery / mixed / agro-processing |
| `farmSizeHectares` | number | No | Farm area in hectares |
| `cropOrLivestockTypes` | string[] | No | Array of produce type identifiers |
| `yearsInOperation` | number | No | Years actively farming |
| `annualRevenueNGN` | number | No | Annual revenue in Naira |
| `grantProgram` | string | Yes | Target grant programme name |
| `requestedFundingAmountNGN` | number | Yes | Amount requested in Naira |
| `proposedProjectDescription` | string | Yes | Minimum 100 characters |
| `hasBVN` | boolean | No | Has Bank Verification Number |
| `hasCACRegistration` | boolean | No | CAC registered business |
| `isMemberOfCooperative` | boolean | No | Cooperative society member |
| `hasLandDocument` | boolean | No | Holds C of O / R of O / Survey Plan |
| `isSmallholderFarmer` | boolean | No | Farm under 5 hectares |
| `isYouthFarmer` | boolean | No | Aged 18–35 |
| `isWomanFarmer` | boolean | No | Woman-led farm |
| `hasExistingLoanDefault` | boolean | No | CRMS loan default on record |
| `additionalNotes` | string | No | Any supplementary context |

### POST `/api/v1/application` — Response

```json
{
  "success": true,
  "applicationReference": "NAGAP-A3K8M2",
  "submittedAt": "2026-06-09T10:30:00.000Z",
  "status": "under_review",
  "farmerName": "Adaeze Okonkwo",
  "grantProgram": "CBN Anchor Borrowers Programme",
  "message": "Application submitted successfully. You will be contacted within 10–15 working days."
}
```

### PATCH `/api/v1/application/[ref]` — Request Body

```json
{
  "status": "approved",
  "adminNotes": "All documents verified. Disbursement scheduled for 15 July 2026."
}
```

Valid status values: `under_review` | `document_verification` | `approved` | `rejected` | `additional_info_required`

---

## Grant Programmes

NAGAP currently accepts applications for the following government agricultural financing programmes:

| Programme | Administering Body | Maximum Amount |
|-----------|-------------------|----------------|
| CBN Anchor Borrowers Programme | Central Bank of Nigeria | ₦5,000,000 |
| NIRSAL AGSMEIS | NIRSAL Plc / CBN | ₦10,000,000 |
| BOA Micro-Agriculture Loan | Bank of Agriculture | ₦1,500,000 |
| BOA Small/Medium Agriculture Loan | Bank of Agriculture | ₦50,000,000 |
| FMARD APPEALS | Federal Ministry of Agriculture | ₦3,000,000 |
| IFAD VCDP | IFAD / Federal Government | ₦2,500,000 |
| State Ministry Programmes | 36 State Ministries of Agriculture | Varies by state |

---

## Integration with AgriGrant AI

NAGAP is designed to act as the intake point for the AgriGrant AI pipeline. The integration works as follows:

1. A farmer submits their application through NAGAP's five-section form
2. The NAGAP API validates the submission, generates a `NAGAP-XXXXXX` reference number, and stores the application
3. The submission payload is forwarded to the **AgriGrant API Workflow** — a UiPath Studio Web project — which triggers the five-agent pipeline
4. The pipeline runs asynchronously: Agent 1 discovers matching grants, Agent 2 scores eligibility, Agent 3 validates uploaded documents, Agent 4 generates application letters, and Agent 5 packages the full submission instructions
5. On pipeline completion, Agent 5 triggers a SendGrid email to the farmer containing their eligibility score, matched grants, final application letter, and submission instructions
6. The AgriGrant API can optionally PATCH the NAGAP application status via `/api/v1/application/[ref]` to reflect pipeline results in the admin dashboard

```
Farmer submits on NAGAP
        |
        v
POST /api/v1/application
        |
        ├── Store application (in-memory / Vercel Postgres)
        ├── Generate NAGAP-XXXXXX reference
        └── Forward to AgriGrant API Workflow
                        |
                        v
            UiPath Agentic Pipeline (5 Agents)
                        |
                        v
            SendGrid email → Farmer
                        |
                        v
            PATCH /api/v1/application/[ref]  ← Optional status sync
```

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.5.18 |
| Language | TypeScript | 5 |
| UI Library | React | 19.0.3 |
| Styling | Tailwind CSS | 3.4.6 |
| Icons | Heroicons (`@heroicons/react`) | 2.2.0 |
| Font | Plus Jakarta Sans (local variable font) | — |
| Form Validation | Zod | latest |
| Form Handling | React Hook Form | 7.78.0 |
| Notifications | Sonner | latest |
| Charts | Recharts | 2.15.2 |
| Email (production) | SendGrid via AgriGrant API | — |
| Database (production) | Vercel Postgres (`@vercel/postgres`) | latest |
| File Storage (production) | Vercel Blob (`@vercel/blob`) | latest |
| Deployment | Vercel / Netlify | — |

---

## Local Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Navigate to the web directory
cd NAGAP/web

# Install dependencies
npm install

# Start the development server (runs on port 4028)
npm run dev
```

### Available Routes

| URL | Page |
|-----|------|
| `http://localhost:4028` | Landing page |
| `http://localhost:4028/grant-application-form` | Application form |
| `http://localhost:4028/status` | Status checker |
| `http://localhost:4028/success-confirmation-p` | Submission confirmation |
| `http://localhost:4028/admin` | Admin dashboard |

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 4028 |
| `npm run build` | Build for production |
| `npm run serve` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format all source files with Prettier |
| `npm run type-check` | Run TypeScript compiler check without emitting |

---

## Environment Variables

Create a `.env.local` file in the `web/` directory for production configuration. The application runs entirely on in-memory mock data in development without these variables.

```env
# Vercel Postgres — production application storage
POSTGRES_URL=your_vercel_postgres_connection_string

# SendGrid — transactional email delivery
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=info@agrigrant.xyz

# AgriGrant API — UiPath pipeline trigger endpoint
AGRIGRANT_API_URL=your_uipath_api_workflow_url
AGRIGRANT_API_KEY=your_uipath_api_key

# Admin authentication
ADMIN_SECRET=your_admin_auth_secret
```

---

## Test Data

### Application Form

```json
{
  "farmerName": "Adamu Livestock",
  "farmerEmail": "test@example.com",
  "farmLocation": "Rivers State, Port Harcourt LGA",
  "farmSizeHectares": 3.2,
  "farmType": "Mixed Farming",
  "cropOrLivestockTypes": ["crop_cattle", "crop_poultry", "crop_cassava"],
  "yearsInOperation": 4,
  "annualRevenueNGN": 14200000,
  "requestedFundingAmountNGN": 5000000,
  "proposedProjectDescription": "Purchase of additional cattle for fattening and expansion of existing poultry pens to increase egg production capacity from 500 to 2,000 eggs per week.",
  "hasBVN": true,
  "hasCACRegistration": true,
  "isMemberOfCooperative": true,
  "hasLandDocument": true,
  "isSmallholderFarmer": true,
  "isYouthFarmer": true,
  "isWomanFarmer": false,
  "hasExistingLoanDefault": false
}
```

### Status Checker

| Reference | Email | Status |
|-----------|-------|--------|
| `NAGAP-A3K8M2` | adaeze.okonkwo@gmail.com | Document Verification |
| `NAGAP-B7X9P4` | emeka.nwosu@yahoo.com | Approved |

---

## Production Deployment

### Vercel (Recommended)

1. Connect the `web/` directory to a Vercel project
2. Add all environment variables in the Vercel dashboard
3. Provision a Vercel Postgres database and copy the connection string to `POSTGRES_URL`
4. Deploy — Vercel will detect Next.js and configure the build automatically

### Database Migration

Run the schema initialisation once after first deploy. The schema is defined in `src/lib/db.ts` and creates the `nagap_applications` table with all required columns. In production, call `initializeSchema()` from a one-time migration script or a dedicated `/api/migrate` route protected behind `ADMIN_SECRET`.

---

## Nigerian Compliance Framework

The compliance checklist in Section 4 of the application form maps directly to the actual eligibility requirements of each grant programme:

| Requirement | Document | Programmes Requiring It |
|-------------|----------|------------------------|
| BVN | 11-digit bank-linked number | CBN ABP, NIRSAL AGSMEIS, BOA (all) |
| NIN | 11-digit NIMC number | All programmes |
| CAC Registration | RC or BN number | NIRSAL AGSMEIS, CBN CACS, FMARD APPEALS |
| Cooperative Membership | Membership letter | CBN ABP, IFAD VCDP |
| Land Document | C of O / R of O / Survey Plan | BOA medium/large loans |
| Clean CRMS Record | No active loan default | CBN ABP, NIRSAL, BOA |
| Bank Statement | 3–6 months, bank-stamped | NIRSAL AGSMEIS, BOA medium/large loans |

---

## Roadmap

### Near-term
- Production database migration from in-memory store to Vercel Postgres
- Admin authentication via `ADMIN_SECRET` header or session-based login
- Webhook endpoint to receive status updates pushed from the AgriGrant AI pipeline
- Real document upload to Vercel Blob storage (replacing filename-only storage)

### Medium-term
- SMS notifications via Termii or Twilio for farmers without email access
- Application tracking via WhatsApp using Twilio WhatsApp API
- Bulk application import for cooperative group submissions (CSV upload)
- Automated email reminders for applications stuck at `additional_info_required`

### Long-term
- Analytics dashboard for grant success rates, approval trends by state, programme utilisation
- Predictive eligibility pre-screening on the landing page before full form submission
- Multilingual support — Pidgin English, Hausa, Yoruba, Igbo
- Offline-capable progressive web app for low-connectivity rural areas

---

## Contributing

Please read `CONTRIBUTING.md` before submitting pull requests. All contributions must pass existing lint and type-check scripts (`npm run lint` and `npm run type-check`) before review.

---

## License

Proprietary. All rights reserved.

Copyright (c) 2026 REM Labs. Unauthorised reproduction or distribution of this software or its components is prohibited.

---

## Team

| Name | Role | Contact |
|------|------|---------|
| Nwajari Emmanuel | Founder & Technical Lead | nwajariemmanuel355@gmail.com |
| Kodu Giobari | Operations Lead | giobarikodu@gmail.com |

---

*A REM Labs product. Built for Nigerian farmers.*
