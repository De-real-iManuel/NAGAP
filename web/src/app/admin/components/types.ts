export type ApplicationStatus =
  | 'under_review'
  | 'document_verification'
  | 'approved'
  | 'rejected'
  | 'additional_info_required';

export interface Application {
  applicationReference: string;
  farmerName: string;
  farmerEmail: string;
  farmerPhone: string;
  stateOfResidence: string;
  lga: string;
  farmLocation: string;
  farmType: string;
  farmSizeHectares?: number;
  cropOrLivestockTypes?: string[];
  yearsInOperation?: number;
  annualRevenueNGN?: number;
  grantProgram: string;
  requestedFundingAmountNGN: number;
  proposedProjectDescription: string;
  hasBVN?: boolean;
  hasCACRegistration?: boolean;
  isMemberOfCooperative?: boolean;
  hasLandDocument?: boolean;
  isSmallholderFarmer?: boolean;
  isYouthFarmer?: boolean;
  isWomanFarmer?: boolean;
  hasExistingLoanDefault?: boolean;
  additionalNotes?: string;
  documents?: Record<string, string | null>;
  status: ApplicationStatus;
  adminNotes?: string | null;
  submittedAt: string;
  updatedAt: string;
}

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string; icon: string }> = {
  under_review: { label: 'Under Review', className: 'status-under-review', icon: 'ClockIcon' },
  document_verification: { label: 'Doc Verification', className: 'status-doc-verification', icon: 'DocumentMagnifyingGlassIcon' },
  approved: { label: 'Approved', className: 'status-approved', icon: 'CheckCircleIcon' },
  rejected: { label: 'Rejected', className: 'status-rejected', icon: 'XCircleIcon' },
  additional_info_required: { label: 'More Info Needed', className: 'status-additional-info', icon: 'ExclamationCircleIcon' },
};

// Rich mock data covering all statuses, states, programs
export const MOCK_APPLICATIONS: Application[] = [
  {
    applicationReference: 'NAGAP-A3K8M2', farmerName: 'Adaeze Okonkwo', farmerEmail: 'adaeze@gmail.com',
    farmerPhone: '08031234567', stateOfResidence: 'Enugu', lga: 'Enugu North', farmLocation: 'Km 5 Enugu-Onitsha Road',
    farmType: 'Crop Farming', farmSizeHectares: 3, cropOrLivestockTypes: ['crop_rice', 'crop_maize'],
    yearsInOperation: 6, annualRevenueNGN: 1200000, grantProgram: 'CBN Anchor Borrowers Programme',
    requestedFundingAmountNGN: 2500000, proposedProjectDescription: 'Expanding rice cultivation from 2 to 5 hectares with modern irrigation equipment to boost yield.',
    hasBVN: true, isMemberOfCooperative: true, isSmallholderFarmer: true, status: 'document_verification',
    adminNotes: 'Documents received. Under verification.', submittedAt: '2026-05-14T09:22:00.000Z', updatedAt: '2026-05-20T14:10:00.000Z',
  },
  {
    applicationReference: 'NAGAP-B7X9P4', farmerName: 'Emeka Nwosu', farmerEmail: 'emeka.nwosu@yahoo.com',
    farmerPhone: '08099876543', stateOfResidence: 'Anambra', lga: 'Onitsha North', farmLocation: 'Behind Oguta Rice Mill, Oguta LGA',
    farmType: 'Mixed Farming', farmSizeHectares: 5, cropOrLivestockTypes: ['crop_rice', 'crop_cassava'],
    yearsInOperation: 10, annualRevenueNGN: 3500000, grantProgram: 'NIRSAL AGSMEIS',
    requestedFundingAmountNGN: 5000000, proposedProjectDescription: 'Agro-processing facility expansion for cassava processing and packaging for export.',
    hasBVN: true, hasCACRegistration: true, hasLandDocument: true, status: 'approved',
    adminNotes: 'All documents verified. Disbursement scheduled for June 2026.', submittedAt: '2026-04-28T11:05:00.000Z', updatedAt: '2026-05-25T09:30:00.000Z',
  },
  {
    applicationReference: 'NAGAP-C2R5T1', farmerName: 'Fatima Abdullahi', farmerEmail: 'fatima.a@mail.com',
    farmerPhone: '07041239876', stateOfResidence: 'Kano', lga: 'Kano Municipal', farmLocation: 'Sharada Industrial Area, Kano',
    farmType: 'Livestock', farmSizeHectares: 1.5, cropOrLivestockTypes: ['crop_cattle', 'crop_goat'],
    yearsInOperation: 4, annualRevenueNGN: 800000, grantProgram: 'BOA Micro-Agriculture Loan',
    requestedFundingAmountNGN: 1200000, proposedProjectDescription: 'Purchase of 20 additional cattle and expansion of existing pen facilities.',
    hasBVN: true, isWomanFarmer: true, isSmallholderFarmer: true, status: 'under_review',
    submittedAt: '2026-06-01T08:00:00.000Z', updatedAt: '2026-06-01T08:00:00.000Z',
  },
  {
    applicationReference: 'NAGAP-D9W3L6', farmerName: 'Tunde Adeyemi', farmerEmail: 'tunde.adeyemi@hotmail.com',
    farmerPhone: '08155554433', stateOfResidence: 'Oyo', lga: 'Ibadan North', farmLocation: 'Apata Area, Ibadan',
    farmType: 'Poultry', farmSizeHectares: 0.8, cropOrLivestockTypes: ['crop_poultry'],
    yearsInOperation: 3, annualRevenueNGN: 650000, grantProgram: 'FMARD APPEALS',
    requestedFundingAmountNGN: 2000000, proposedProjectDescription: 'Construction of additional poultry house for 5,000 broilers and purchase of feed processing equipment.',
    hasBVN: true, isYouthFarmer: true, status: 'additional_info_required',
    adminNotes: 'Land document required. Please upload Certificate of Occupancy.', submittedAt: '2026-05-30T14:33:00.000Z', updatedAt: '2026-06-02T10:00:00.000Z',
  },
  {
    applicationReference: 'NAGAP-E4N7Q8', farmerName: 'Ngozi Eze', farmerEmail: 'ngozi.eze@gmail.com',
    farmerPhone: '09012348765', stateOfResidence: 'Imo', lga: 'Owerri North', farmLocation: 'Off Douglas Road, Owerri',
    farmType: 'Fishery', farmSizeHectares: 2, cropOrLivestockTypes: ['crop_catfish'],
    yearsInOperation: 7, annualRevenueNGN: 2100000, grantProgram: 'IFAD VCDP',
    requestedFundingAmountNGN: 2500000, proposedProjectDescription: 'Expansion of catfish ponds from 8 to 15 units with automated feeding system installation.',
    hasBVN: true, hasLandDocument: true, isWomanFarmer: true, status: 'rejected',
    adminNotes: 'Imo State is not in IFAD VCDP target states for 2026 cycle. Applicant advised to apply for BOA loan.', submittedAt: '2026-05-10T16:45:00.000Z', updatedAt: '2026-05-28T11:20:00.000Z',
  },
  {
    applicationReference: 'NAGAP-F1P6H3', farmerName: 'Ibrahim Musa', farmerEmail: 'ibrahim.musa@mail.com',
    farmerPhone: '08061119988', stateOfResidence: 'Kaduna', lga: 'Kaduna South', farmLocation: 'Rigasa Area, Kaduna',
    farmType: 'Crop Farming', farmSizeHectares: 4.5, cropOrLivestockTypes: ['crop_maize', 'crop_soybean'],
    yearsInOperation: 12, annualRevenueNGN: 4200000, grantProgram: 'CBN Anchor Borrowers Programme',
    requestedFundingAmountNGN: 4500000, proposedProjectDescription: 'Modern maize processing plant and soybean storage silos to reduce post-harvest losses.',
    hasBVN: true, hasCACRegistration: true, isMemberOfCooperative: true, hasLandDocument: true, status: 'approved',
    adminNotes: 'Approved. Disbursement batch #3 June 2026.', submittedAt: '2026-04-15T10:10:00.000Z', updatedAt: '2026-05-22T15:00:00.000Z',
  },
  {
    applicationReference: 'NAGAP-G8V2K9', farmerName: 'Chioma Okafor', farmerEmail: 'chioma.ok@gmail.com',
    farmerPhone: '07033456789', stateOfResidence: 'Rivers', lga: 'Port Harcourt', farmLocation: 'Trans-Amadi, Port Harcourt',
    farmType: 'Agro-processing', farmSizeHectares: 1, cropOrLivestockTypes: ['crop_cassava', 'crop_yam'],
    yearsInOperation: 5, annualRevenueNGN: 1800000, grantProgram: 'NIRSAL AGSMEIS',
    requestedFundingAmountNGN: 8000000, proposedProjectDescription: 'Establishment of garri processing factory with packaging line serving Rivers and Bayelsa states.',
    hasBVN: true, hasCACRegistration: true, isWomanFarmer: true, isYouthFarmer: true, status: 'under_review',
    submittedAt: '2026-06-05T09:15:00.000Z', updatedAt: '2026-06-05T09:15:00.000Z',
  },
  {
    applicationReference: 'NAGAP-H5J3M7', farmerName: 'Abubakar Sadiq', farmerEmail: 'abubakar.s@yahoo.com',
    farmerPhone: '08071122334', stateOfResidence: 'Niger', lga: 'Bida', farmLocation: 'Bida-Minna Road, Niger State',
    farmType: 'Crop Farming', farmSizeHectares: 8, cropOrLivestockTypes: ['crop_rice', 'crop_yam'],
    yearsInOperation: 15, annualRevenueNGN: 5500000, grantProgram: 'IFAD VCDP',
    requestedFundingAmountNGN: 2000000, proposedProjectDescription: 'Purchase of combine harvester and rice mill for cooperative members in Bida LGA.',
    hasBVN: true, isMemberOfCooperative: true, hasLandDocument: true, status: 'document_verification',
    adminNotes: 'BVN verification pending. Bank statement submitted.', submittedAt: '2026-05-20T12:30:00.000Z', updatedAt: '2026-06-03T08:45:00.000Z',
  },
];
