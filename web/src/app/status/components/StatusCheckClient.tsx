'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface StatusResult {
  applicationReference: string;
  farmerName: string;
  stateOfResidence: string;
  grantProgram: string;
  requestedFundingAmountNGN: number;
  status: string;
  submittedAt: string;
  updatedAt: string;
  adminNotes?: string | null;
}

const statusConfig: Record<string, { label: string; className: string; icon: string; description: string }> = {
  under_review: {
    label: 'Under Review',
    className: 'status-under-review',
    icon: 'ClockIcon',
    description: 'Your application has been received and is currently being reviewed by a NAGAP officer. No action is required from you at this time.',
  },
  document_verification: {
    label: 'Document Verification',
    className: 'status-doc-verification',
    icon: 'DocumentMagnifyingGlassIcon',
    description: 'Your documents are being verified against NIMC and CAC databases by our grant verification team. You may be contacted if additional documents are required.',
  },
  approved: {
    label: 'Approved',
    className: 'status-approved',
    icon: 'CheckCircleIcon',
    description: 'Congratulations! Your application has been approved. You will receive disbursement instructions via SMS and email within 5 working days.',
  },
  rejected: {
    label: 'Rejected',
    className: 'status-rejected',
    icon: 'XCircleIcon',
    description: 'Unfortunately, your application did not meet the eligibility criteria for the selected programme. See admin notes below for details.',
  },
  additional_info_required: {
    label: 'Additional Info Required',
    className: 'status-additional-info',
    icon: 'ExclamationCircleIcon',
    description: 'Additional information or documents are required to process your application. Please contact NAGAP support immediately.',
  },
};

function formatNairaStatic(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

function formatDateStatic(isoString: string): string {
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function StatusCheckClient() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [farmerEmail, setFarmerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refError, setRefError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validate = () => {
    let valid = true;
    if (!referenceNumber.trim()) {
      setRefError('Reference number is required');
      valid = false;
    } else {
      setRefError('');
    }
    if (!farmerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(farmerEmail)) {
      setEmailError('A valid email address is required');
      valid = false;
    } else {
      setEmailError('');
    }
    return valid;
  };

  const handleCheck = async () => {
    if (!validate()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Backend integration: POST /api/v1/applications/check-status
      const response = await fetch('/api/v1/application/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceNumber: referenceNumber.trim().toUpperCase(), farmerEmail: farmerEmail.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'No application found with that reference number and email combination. Please check your details and try again.');
        return;
      }

      setResult(data.application as StatusResult);
    } catch {
      setError('Unable to connect to NAGAP servers. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const config = result ? (statusConfig[result.status] ?? statusConfig['under_review']) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Search form */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-border rounded-lg p-6 shadow-sm sticky top-20">
          <h2 className="text-base font-extrabold text-foreground mb-1">
            Application Lookup
          </h2>
          <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
            Enter the reference number from your acknowledgement receipt and your registered email address.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="referenceNumber" className="label-text">
                Application Reference Number <span className="text-red-500">*</span>
              </label>
              <p className="helper-text mb-1">Format: NAGAP-XXXXXX (e.g. NAGAP-A3K8M2)</p>
              <input
                id="referenceNumber"
                type="text"
                placeholder="e.g. NAGAP-A3K8M2"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                className={`input-field font-mono tracking-wider ${refError ? 'input-error' : ''}`}
              />
              {refError && <p className="error-text">{refError}</p>}
            </div>

            <div>
              <label htmlFor="farmerEmail" className="label-text">
                Registered Email Address <span className="text-red-500">*</span>
              </label>
              <p className="helper-text mb-1">The email you provided during application.</p>
              <input
                id="farmerEmail"
                type="email"
                placeholder="e.g. adaeze.okonkwo@gmail.com"
                value={farmerEmail}
                onChange={(e) => setFarmerEmail(e.target.value)}
                className={`input-field ${emailError ? 'input-error' : ''}`}
              />
              {emailError && <p className="error-text">{emailError}</p>}
            </div>

            <button
              id="checkStatus"
              onClick={handleCheck}
              disabled={isLoading}
              className="w-full btn-primary justify-center py-3"
            >
              {isLoading ? (
                <>
                  <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Icon name="MagnifyingGlassIcon" size={16} />
                  Check Status
                </>
              )}
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <Icon name="LockClosedIcon" size={12} className="inline mr-1 text-primary" />
              Your query is encrypted and your data is protected under NDPR 2019.
            </p>
          </div>        </div>
      </div>

      {/* Results area */}
      <div id="statusResult" className="lg:col-span-2">
        {!result && !error && !isLoading && (
          <div className="bg-white border border-border rounded-lg p-12 text-center">
            <Icon name="DocumentMagnifyingGlassIcon" size={48} className="text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-base font-bold text-foreground mb-2">
              Enter Your Details to Check Status
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Enter your NAGAP reference number and registered email address on the left to view your application status and details.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="bg-white border border-border rounded-lg p-12 text-center">
            <Icon name="ArrowPathIcon" size={36} className="text-primary mx-auto mb-4 animate-spin" />
            <p className="text-sm font-semibold text-foreground">Searching NAGAP database…</p>
            <p className="text-xs text-muted-foreground mt-1">This may take a few seconds.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Icon name="XCircleIcon" size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-800 mb-1">Application Not Found</p>
                <p className="text-sm text-red-700 leading-relaxed">{error}</p>
                <div className="mt-3 text-xs text-red-600 space-y-1">
                  <p>• Check that the reference number is entered correctly (format: NAGAP-XXXXXX)</p>
                  <p>• Ensure the email matches the one used during application</p>
                  <p>• Contact support if you believe this is an error: 0800-624-27-64</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && config && (
          <div className="space-y-5">
            {/* Status header */}
            <div className={`rounded-lg p-5 border ${result.status === 'approved' ? 'bg-green-50 border-green-200' : result.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-white border-border'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${result.status === 'approved' ? 'bg-primary' : result.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'}`}>
                  <Icon name={config.icon as Parameters<typeof Icon>[0]['name']} size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className={`status-badge ${config.className}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{result.applicationReference}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{config.description}</p>
                </div>
              </div>
            </div>

            {/* Application details */}
            <div className="bg-white border border-border rounded-lg overflow-hidden">
              <div className="gov-header-bg px-5 py-3">
                <p className="text-white font-bold text-sm">Application Details</p>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Reference Number', value: result.applicationReference, mono: true },
                  { label: 'Applicant Name', value: result.farmerName },
                  { label: 'State of Residence', value: result.stateOfResidence },
                  { label: 'Grant Programme', value: result.grantProgram },
                  { label: 'Amount Requested', value: formatNairaStatic(result.requestedFundingAmountNGN), mono: true },
                  { label: 'Date Submitted', value: formatDateStatic(result.submittedAt) },
                  { label: 'Last Updated', value: formatDateStatic(result.updatedAt) },
                  { label: 'Current Status', value: config.label },
                ].map((item) => (
                  <div key={`detail-${item.label}`} className="bg-muted rounded p-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">{item.label}</p>
                    <p className={`text-sm font-bold text-foreground ${item.mono ? 'font-mono tabular-nums' : ''}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {result.adminNotes && (
                <div className="px-5 pb-5">
                  <div className="bg-amber-50 border border-amber-200 rounded p-3">
                    <p className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1">
                      <Icon name="ChatBubbleLeftEllipsisIcon" size={13} className="text-amber-600" />
                      Officer Notes
                    </p>
                    <p className="text-xs text-amber-700 leading-relaxed">{result.adminNotes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Next steps based on status */}
            {result.status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <p className="text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                  <Icon name="CheckCircleIcon" size={16} className="text-primary" />
                  Next Steps for Approved Application
                </p>
                <ul className="space-y-1.5 text-xs text-green-700">
                  <li className="flex items-start gap-1.5"><Icon name="ChevronRightIcon" size={10} className="mt-0.5 text-primary" />Contact the NAGAP office or your designated programme coordinator using your reference number and NIN.</li>
                  <li className="flex items-start gap-1.5"><Icon name="ChevronRightIcon" size={10} className="mt-0.5 text-primary" />Bring original copies of all documents submitted during application.</li>
                  <li className="flex items-start gap-1.5"><Icon name="ChevronRightIcon" size={10} className="mt-0.5 text-primary" />Disbursement will be made directly to your registered bank account within 5 working days.</li>
                </ul>
              </div>
            )}

            {result.status === 'additional_info_required' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                <p className="text-sm font-bold text-purple-800 mb-2 flex items-center gap-2">
                  <Icon name="ExclamationCircleIcon" size={16} className="text-purple-600" />
                  Action Required
                </p>
                <p className="text-xs text-purple-700 mb-2">
                  Please contact NAGAP support immediately to provide the requested additional information or documents.
                </p>
                <p className="text-xs font-bold text-purple-800">Helpline: 0800-624-27-64 · support@nagap.gov.ng</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}