'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface SubmissionData {
  applicationReference: string;
  farmerName: string;
  grantProgram: string;
  submittedAt: string;
  status: string;
  requestedFundingAmountNGN: number;
  stateOfResidence: string;
}

const FALLBACK_DATA: SubmissionData = {
  applicationReference: 'NAGAP-DEMO01',
  farmerName: 'Applicant',
  grantProgram: 'CBN Anchor Borrowers Programme',
  submittedAt: new Date().toISOString(),
  status: 'under_review',
  requestedFundingAmountNGN: 0,
  stateOfResidence: 'Lagos',
};

function formatNairaStatic(amount: number): string {
  const formatted = amount.toLocaleString('en-NG');
  return `₦${formatted}`;
}

function formatDateStatic(isoString: string): string {
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} at ${hours}:${mins} WAT`;
}

const statusLabelMap: Record<string, string> = {
  under_review: 'Under Review',
  document_verification: 'Document Verification',
  approved: 'Approved',
  rejected: 'Rejected',
  additional_info_required: 'Additional Info Required',
};

export default function SuccessContent() {
  const [data, setData] = useState<SubmissionData>(FALLBACK_DATA);
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');

  useEffect(() => {
    // Backend integration: could also fetch fresh data from /api/v1/applications/[ref]
    try {
      const stored = sessionStorage.getItem('nagap_submission');
      if (stored) {
        const parsed = JSON.parse(stored) as SubmissionData;
        setData(parsed);
        setFormattedDate(formatDateStatic(parsed.submittedAt));
        setFormattedAmount(formatNairaStatic(parsed.requestedFundingAmountNGN));
      } else {
        setFormattedDate(formatDateStatic(FALLBACK_DATA.submittedAt));
        setFormattedAmount(formatNairaStatic(FALLBACK_DATA.requestedFundingAmountNGN));
      }
    } catch {
      setFormattedDate(formatDateStatic(FALLBACK_DATA.submittedAt));
      setFormattedAmount(formatNairaStatic(FALLBACK_DATA.requestedFundingAmountNGN));
    }
  }, []);

  const statusLabel = statusLabelMap[data.status] ?? 'Under Review';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = [
      '================================================================',
      '  NIGERIAN AGRICULTURAL GRANT APPLICATION PORTAL (NAGAP)',
      '  Federal Ministry of Agriculture & Rural Development',
      '  Federal Republic of Nigeria',
      '================================================================',
      '',
      '  APPLICATION ACKNOWLEDGEMENT RECEIPT',
      '',
      `  Reference Number : ${data.applicationReference}`,
      `  Applicant Name   : ${data.farmerName}`,
      `  Grant Programme  : ${data.grantProgram}`,
      `  Amount Requested : ${formattedAmount}`,
      `  State            : ${data.stateOfResidence}`,
      `  Submitted On     : ${formattedDate}`,
      `  Current Status   : ${statusLabel}`,
      '',
      '----------------------------------------------------------------',
      '  NEXT STEPS',
      '  1. Your application is now under review by NAGAP officers.',
      '  2. Document verification will commence within 5 working days.',
      '  3. You will be contacted via SMS and email within 10-15 working days.',
      '  4. Keep this reference number safe for all future correspondence.',
      '',
      '  For enquiries: support@nagap.gov.ng | 0800-624-27-64',
      '================================================================',
      '  This is an automatically generated acknowledgement receipt.',
      '  NAGAP does not charge fees. Report fraud to EFCC: 0800-CALL-EFCC',
      '================================================================',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NAGAP-Acknowledgement-${data.applicationReference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Main confirmation card */}
      <div className="xl:col-span-2 space-y-6">
        {/* Success banner */}
        <div className="bg-green-50 border border-green-300 rounded-lg p-6 flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Icon name="CheckIcon" size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-primary mb-1">
              Application Successfully Submitted!
            </h2>
            <p className="text-green-800 text-sm leading-relaxed">
              Your agricultural grant application has been received by the Nigerian Agricultural Grant Application Portal (NAGAP). A confirmation SMS and email have been sent to your registered contact details.
            </p>
          </div>
        </div>

        {/* Reference number card — primary robot target */}
        <div className="bg-white border-2 border-primary rounded-lg overflow-hidden shadow-sm">
          {/* Card header */}
          <div className="gov-header-bg px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="ShieldCheckIcon" size={22} className="text-accent" />
              <div>
                <p className="text-green-200 text-xs font-semibold uppercase tracking-wider">
                  Federal Republic of Nigeria
                </p>
                <p className="text-white font-bold text-sm">
                  NAGAP — Application Acknowledgement
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-300 text-xs">Issued by</p>
              <p className="text-white text-xs font-semibold">FMARD / NAGAP Portal</p>
            </div>
          </div>

          {/* Reference number — id="applicationReference" for RPA robot */}
          <div className="px-6 py-6 border-b border-border">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Application Reference Number
            </p>
            <div className="flex items-center gap-4">
              <span
                id="applicationReference"
                className="text-3xl font-black text-primary tracking-widest tabular-nums font-mono"
              >
                {data.applicationReference}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(data.applicationReference);
                }}
                className="p-2 rounded border border-border hover:bg-muted transition-colors"
                title="Copy reference number"
              >
                <Icon name="ClipboardDocumentIcon" size={16} className="text-muted-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Quote this reference number in all correspondence with NAGAP and partner agencies.
            </p>
          </div>

          {/* Application details grid */}
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                Applicant Name
              </p>
              <p className="text-sm font-bold text-foreground">{data.farmerName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                Grant Programme
              </p>
              <p className="text-sm font-bold text-foreground">{data.grantProgram}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                Amount Requested
              </p>
              <p className="text-sm font-bold text-foreground tabular-nums">{formattedAmount}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                State of Residence
              </p>
              <p className="text-sm font-bold text-foreground">{data.stateOfResidence}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                Date Submitted
              </p>
              <p className="text-sm font-bold text-foreground tabular-nums">{formattedDate}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                Current Status
              </p>
              {/* id="submissionStatus" — robot reads this element */}
              <span
                id="submissionStatus"
                className="status-badge status-under-review"
              >
                <Icon name="ClockIcon" size={10} />
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Card footer */}
          <div className="px-6 py-3 bg-muted border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              <Icon name="ShieldCheckIcon" size={12} className="inline mr-1 text-primary" />
              Verified submission · TLS 1.3 encrypted · NDPR compliant
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="btn-secondary text-xs py-1.5 px-3 no-print"
              >
                <Icon name="PrinterIcon" size={13} />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="btn-primary text-xs py-1.5 px-3 no-print"
              >
                <Icon name="ArrowDownTrayIcon" size={13} />
                Download Receipt
              </button>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="text-base font-extrabold text-foreground mb-4 flex items-center gap-2">
            <Icon name="ArrowRightCircleIcon" size={18} className="text-primary" />
            What Happens Next
          </h3>
          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Application Acknowledgement',
                description: 'You will receive an SMS and email confirmation within 30 minutes confirming your submission.',
                status: 'complete',
                timeline: 'Immediate',
              },
              {
                step: '02',
                title: 'Initial Review',
                description: 'A NAGAP officer will review your application for completeness and eligibility against the selected grant programme criteria.',
                status: 'active',
                timeline: '1–3 working days',
              },
              {
                step: '03',
                title: 'Document Verification',
                description: 'Your uploaded documents will be verified against NIMC (NIN), CBN CRMS, and CAC databases. You may be contacted for additional documents.',
                status: 'pending',
                timeline: '3–7 working days',
              },
              {
                step: '04',
                title: 'Credit & Eligibility Assessment',
                description: 'Your application is forwarded to the relevant partner agency (CBN/NIRSAL/BOA/FMARD) for credit assessment and final eligibility scoring.',
                status: 'pending',
                timeline: '5–10 working days',
              },
              {
                step: '05',
                title: 'Decision & Notification',
                description: 'You will be notified of the final decision via SMS and email. If approved, disbursement instructions will be provided.',
                status: 'pending',
                timeline: '10–15 working days',
              },
            ].map((item) => (
              <div key={`step-${item.step}`} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={[
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0',
                      item.status === 'complete' ?'bg-primary text-white'
                        : item.status === 'active' ?'bg-amber-500 text-white' :'bg-muted text-muted-foreground border border-border',
                    ].join(' ')}
                  >
                    {item.status === 'complete' ? (
                      <Icon name="CheckIcon" size={14} />
                    ) : (
                      item.step
                    )}
                  </div>
                  {item.step !== '05' && (
                    <div className="w-px flex-1 bg-border mt-1 mb-0 min-h-[24px]" />
                  )}
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-foreground">{item.title}</p>
                    <span className="text-xs text-muted-foreground">· {item.timeline}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important notices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded p-4">
            <p className="text-sm font-bold text-amber-900 mb-1 flex items-center gap-1">
              <Icon name="ExclamationTriangleIcon" size={14} className="text-amber-600" />
              Anti-Fraud Warning
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              NAGAP will never ask you to pay any fee to process your application. If anyone contacts you demanding payment, report immediately to EFCC: <strong>0800-CALL-EFCC</strong>.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-1">
              <Icon name="InformationCircleIcon" size={14} className="text-blue-600" />
              Track Your Application
            </p>
            <p className="text-xs text-blue-800 leading-relaxed mb-2">
              You can check your application status at any time using your reference number and registered email address.
            </p>
            <Link
              href="/status"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 underline"
            >
              Check Application Status →
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="xl:col-span-1 space-y-5">
        {/* Quick reference card */}
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <h4 className="text-sm font-extrabold text-foreground mb-4 uppercase tracking-wider">
            Quick Reference
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-2.5 bg-primary-light rounded border border-primary/20">
              <Icon name="HashtagIcon" size={14} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Reference Number</p>
                <p className="text-sm font-black text-primary tabular-nums font-mono tracking-wider">
                  {data.applicationReference}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2.5 bg-muted rounded">
              <Icon name="DocumentTextIcon" size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Programme</p>
                <p className="text-xs font-semibold text-foreground">{data.grantProgram}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2.5 bg-muted rounded">
              <Icon name="BanknotesIcon" size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Amount Requested</p>
                <p className="text-sm font-bold text-foreground tabular-nums">{formattedAmount}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2.5 bg-muted rounded">
              <Icon name="CalendarIcon" size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-xs font-semibold text-foreground">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="bg-white border border-border rounded-lg p-5 shadow-sm space-y-3">
          <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
            Actions
          </h4>
          <button
            onClick={handlePrint}
            className="w-full btn-secondary justify-center text-sm"
          >
            <Icon name="PrinterIcon" size={15} />
            Print Acknowledgement
          </button>
          <button
            onClick={handleDownload}
            className="w-full btn-primary justify-center text-sm"
          >
            <Icon name="ArrowDownTrayIcon" size={15} />
            Download Receipt (.txt)
          </button>
          <Link
            href="/status"
            className="w-full btn-secondary justify-center text-sm"
          >
            <Icon name="MagnifyingGlassIcon" size={15} />
            Track Application Status
          </Link>
          <Link
            href="/grant-application-form"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground border border-border rounded transition-colors hover:bg-muted"
          >
            <Icon name="DocumentPlusIcon" size={15} />
            Submit Another Application
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground border border-border rounded transition-colors hover:bg-muted"
          >
            <Icon name="HomeIcon" size={15} />
            Return to Home
          </Link>
        </div>

        {/* Contact support */}
        <div className="bg-secondary rounded-lg p-5 text-white">
          <h4 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
            <Icon name="PhoneIcon" size={15} className="text-accent" />
            Need Assistance?
          </h4>
          <ul className="space-y-2 text-xs text-green-200">
            <li className="flex items-center gap-2">
              <Icon name="PhoneIcon" size={12} className="text-accent" />
              Helpline: 0800-624-27-64 (Free)
            </li>
            <li className="flex items-center gap-2">
              <Icon name="EnvelopeIcon" size={12} className="text-accent" />
              support@nagap.gov.ng
            </li>
            <li className="flex items-center gap-2">
              <Icon name="ClockIcon" size={12} className="text-accent" />
              Mon–Fri: 8:00–17:00 WAT
            </li>
          </ul>
          <p className="text-green-300 text-xs mt-3 leading-relaxed">
            Always quote your reference number <strong className="text-white">{data.applicationReference}</strong> when contacting support.
          </p>
        </div>

        {/* NAGAP information */}
        <div className="bg-muted border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <Icon name="InformationCircleIcon" size={12} className="inline mr-1 text-primary" />
            This portal is operated by the Federal Ministry of Agriculture and Rural Development (FMARD) in partnership with CBN, NIRSAL, BOA, and IFAD. Applications are subject to the terms of the respective grant programme guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}