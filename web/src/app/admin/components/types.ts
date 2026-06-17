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
  hasNoLoanDefault?: boolean;
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

