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
  grantProgram: 'IFAD VCDP Grant (International Fund for Agricultural Development)',
  submittedAt: new Date().toISOString(),
  status: 'under_review',
  requestedFundingAmountNGN: 0,
  stateOfResidence: 'Lagos',
};

function formatNairaStatic(amount: number): string {
  const formatted = amount.toLocaleString('en-NG');
  return `\u20a6${formatted}`;
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

// ─── PDF Generation ──────────────────────────────────────────────────────────
async function generatePDF(data: SubmissionData, formattedDate: string, formattedAmount: string) {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const PAGE_W = 210;
  const MARGIN = 18;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const GREEN_DARK = [27, 94, 32] as [number, number, number];    // #1B5E20
  const GREEN_MED  = [46, 125, 50] as [number, number, number];   // #2E7D32
  const GREEN_LIGHT= [200, 230, 201] as [number, number, number]; // #C8E6C9
  const GOLD       = [255, 193, 7] as [number, number, number];   // #FFC107
  const GREY_BG    = [245, 245, 245] as [number, number, number];
  const BORDER     = [220, 220, 220] as [number, number, number];
  const TEXT_DARK  = [30, 30, 30] as [number, number, number];
  const TEXT_MID   = [80, 80, 80] as [number, number, number];
  const TEXT_LIGHT = [140, 140, 140] as [number, number, number];
  const WHITE      = [255, 255, 255] as [number, number, number];

  let y = 0;

  // ── Header banner ──────────────────────────────────────────────────────────
  doc.setFillColor(...GREEN_DARK);
  doc.rect(0, 0, PAGE_W, 38, 'F');

  // Gold top stripe
  doc.setFillColor(...GOLD);
  doc.rect(0, 0, PAGE_W, 3, 'F');

  // Coat of arms placeholder (circle)
  doc.setFillColor(...GREEN_MED);
  doc.circle(MARGIN + 10, 19, 8, 'F');
  doc.setFillColor(...GOLD);
  doc.circle(MARGIN + 10, 19, 6, 'F');
  doc.setFillColor(...GREEN_DARK);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('NG', MARGIN + 10, 20.5, { align: 'center' });

  // Title text
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 230, 180);
  doc.text('FEDERAL REPUBLIC OF NIGERIA', MARGIN + 22, 13);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Nigerian Agricultural Grant Application Portal', MARGIN + 22, 21);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 240, 200);
  doc.text('Federal Ministry of Agriculture & Rural Development (FMARD)', MARGIN + 22, 28);

  // "OFFICIAL RECEIPT" badge on right
  doc.setFillColor(...GOLD);
  doc.roundedRect(PAGE_W - MARGIN - 36, 9, 36, 12, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GREEN_DARK);
  doc.text('APPLICATION RECEIPT', PAGE_W - MARGIN - 18, 16.5, { align: 'center' });

  // Gold bottom stripe
  doc.setFillColor(...GOLD);
  doc.rect(0, 35, PAGE_W, 3, 'F');

  y = 48;

  // ── Sub-header: "Application Acknowledgement" ──────────────────────────────
  doc.setFillColor(...GREEN_LIGHT);
  doc.rect(MARGIN, y, CONTENT_W, 10, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GREEN_DARK);
  doc.text('APPLICATION ACKNOWLEDGEMENT RECEIPT', MARGIN + CONTENT_W / 2, y + 7, { align: 'center' });
  y += 16;

  // ── Reference number block ─────────────────────────────────────────────────
  doc.setFillColor(...GREEN_DARK);
  doc.roundedRect(MARGIN, y, CONTENT_W, 22, 3, 3, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREEN_LIGHT);
  doc.text('APPLICATION REFERENCE NUMBER', MARGIN + CONTENT_W / 2, y + 7, { align: 'center' });

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GOLD);
  doc.text(data.applicationReference, MARGIN + CONTENT_W / 2, y + 17, { align: 'center' });

  y += 28;

  // ── Applicant details grid ─────────────────────────────────────────────────
  const COL2 = CONTENT_W / 2 + 2;
  const COL1 = 0;

  const statusLabel = statusLabelMap[data.status] ?? 'Under Review';

  const detailRows: { label: string; value: string; wide?: boolean }[] = [
    { label: 'Applicant Full Name', value: data.farmerName },
    { label: 'State of Residence', value: data.stateOfResidence },
    { label: 'Grant Programme Applied For', value: data.grantProgram, wide: true },
    { label: 'Amount Requested', value: formattedAmount },
    { label: 'Date & Time Submitted', value: formattedDate },
    { label: 'Current Application Status', value: statusLabel },
  ];

  const ROW_H = 18;

  for (let i = 0; i < detailRows.length; i++) {
    const row = detailRows[i];
    const isEven = i % 2 === 0;
    const xOffset = (row.wide || isEven) ? MARGIN : MARGIN + COL2;
    const boxW = row.wide ? CONTENT_W : CONTENT_W / 2 - 2;
    const currentY = y + Math.floor(i / (row.wide ? 1 : 2)) * (ROW_H + 3);

    if (row.wide) {
      // Full-width row
      doc.setFillColor(...GREY_BG);
      doc.roundedRect(MARGIN, currentY, CONTENT_W, ROW_H, 1.5, 1.5, 'F');
      doc.setDrawColor(...BORDER);
      doc.roundedRect(MARGIN, currentY, CONTENT_W, ROW_H, 1.5, 1.5, 'S');

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...TEXT_LIGHT);
      doc.text(row.label.toUpperCase(), MARGIN + 4, currentY + 5.5);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...TEXT_DARK);
      const lines = doc.splitTextToSize(row.value, CONTENT_W - 8);
      doc.text(lines[0], MARGIN + 4, currentY + 13);
    } else {
      // Half-width
      doc.setFillColor(...GREY_BG);
      doc.roundedRect(xOffset, currentY, boxW, ROW_H, 1.5, 1.5, 'F');
      doc.setDrawColor(...BORDER);
      doc.roundedRect(xOffset, currentY, boxW, ROW_H, 1.5, 1.5, 'S');

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...TEXT_LIGHT);
      doc.text(row.label.toUpperCase(), xOffset + 4, currentY + 5.5);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...TEXT_DARK);
      const lines = doc.splitTextToSize(row.value, boxW - 8);
      doc.text(lines[0], xOffset + 4, currentY + 13);
    }
  }

  // Calculate how many rows we drew
  // Rows: name+state (1 pair), programme (1 wide), amount+date (1 pair), status+empty (1 pair) — with re-layout
  // Let's do a simpler approach: 4 blocks each ROW_H + 3
  y += 4 * (ROW_H + 3) + 8;

  // ── "What Happens Next" section ────────────────────────────────────────────
  doc.setFillColor(...GREEN_DARK);
  doc.rect(MARGIN, y, CONTENT_W, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('WHAT HAPPENS NEXT', MARGIN + 4, y + 5.8);
  y += 12;

  const steps = [
    { num: '01', title: 'Application Acknowledgement', desc: 'You will receive an SMS and email confirmation within 30 minutes confirming your submission.', done: true },
    { num: '02', title: 'Initial Review', desc: 'A NAGAP officer will review your application for completeness and eligibility (1–3 working days).' },
    { num: '03', title: 'Document Verification', desc: 'Your uploaded documents will be verified against NIMC (NIN) and CAC databases (3–7 working days).' },
    { num: '04', title: 'Grant Eligibility Assessment', desc: 'Forwarded to the relevant partner agency (FMARD/IFAD/USAID/FAO) for final scoring (5–10 working days).' },
    { num: '05', title: 'Decision & Notification', desc: 'You will be notified of the final decision via SMS and email. If approved, disbursement instructions follow (10–15 working days).' },
  ];

  for (const step of steps) {
    // Circle number
    if (step.done) {
      doc.setFillColor(...GREEN_MED);
    } else {
      doc.setFillColor(...GREY_BG);
      doc.setDrawColor(...BORDER);
    }
    doc.circle(MARGIN + 5, y + 4, 4, step.done ? 'F' : 'FD');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(step.done ? 255 : 120, step.done ? 255 : 120, step.done ? 255 : 120);
    doc.text(step.done ? '\u2713' : step.num, MARGIN + 5, y + 5.5, { align: 'center' });

    // Title
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...TEXT_DARK);
    doc.text(step.title, MARGIN + 12, y + 3.5);

    // Description
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_MID);
    const descLines = doc.splitTextToSize(step.desc, CONTENT_W - 14);
    doc.text(descLines, MARGIN + 12, y + 9);

    y += 7 + descLines.length * 4.5 + 2;
  }

  y += 4;

  // ── Important notices ──────────────────────────────────────────────────────
  // Anti-fraud (amber)
  doc.setFillColor(255, 248, 225);
  doc.roundedRect(MARGIN, y, CONTENT_W / 2 - 2, 22, 2, 2, 'F');
  doc.setDrawColor(255, 193, 7);
  doc.roundedRect(MARGIN, y, CONTENT_W / 2 - 2, 22, 2, 2, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(120, 60, 0);
  doc.text('⚠  Anti-Fraud Warning', MARGIN + 4, y + 6);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 50, 0);
  const fraudText = doc.splitTextToSize(
    'NAGAP will NEVER ask you to pay a fee. Report demands for payment to EFCC: 0800-CALL-EFCC.',
    CONTENT_W / 2 - 10
  );
  doc.text(fraudText, MARGIN + 4, y + 12);

  // Contact (blue)
  const col2X = MARGIN + CONTENT_W / 2 + 2;
  doc.setFillColor(227, 242, 253);
  doc.roundedRect(col2X, y, CONTENT_W / 2 - 2, 22, 2, 2, 'F');
  doc.setDrawColor(100, 181, 246);
  doc.roundedRect(col2X, y, CONTENT_W / 2 - 2, 22, 2, 2, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 71, 161);
  doc.text('ℹ  Need Assistance?', col2X + 4, y + 6);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(21, 101, 192);
  doc.text('Helpline: 0800-624-27-64 (Free)', col2X + 4, y + 12);
  doc.text('Email: support@nagap.gov.ng', col2X + 4, y + 17);

  y += 28;

  // ── Footer ─────────────────────────────────────────────────────────────────
  const footerY = 285;

  doc.setFillColor(...GREEN_DARK);
  doc.rect(0, footerY, PAGE_W, 12, 'F');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 230, 180);
  doc.text(
    `NAGAP Portal · FMARD · Ref: ${data.applicationReference} · Generated: ${formatDateStatic(new Date().toISOString())}`,
    PAGE_W / 2,
    footerY + 4.5,
    { align: 'center' }
  );
  doc.setTextColor(...GOLD);
  doc.text(
    'This is an automatically generated official acknowledgement. No physical signature required.',
    PAGE_W / 2,
    footerY + 9,
    { align: 'center' }
  );

  // Gold bottom bar
  doc.setFillColor(...GOLD);
  doc.rect(0, 297, PAGE_W, 3, 'F');

  doc.save(`NAGAP-Acknowledgement-${data.applicationReference}.pdf`);
}

// ─────────────────────────────────────────────────────────────────────────────

export default function SuccessContent() {
  const [data, setData] = useState<SubmissionData>(FALLBACK_DATA);
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
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

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generatePDF(data, formattedDate, formattedAmount);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please use the Print button as an alternative.');
    } finally {
      setIsGeneratingPDF(false);
    }
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

        {/* Reference number card */}
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

          {/* Reference number */}
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
                onClick={() => navigator.clipboard.writeText(data.applicationReference)}
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
              <span
                id="submissionStatus"
                className="status-badge status-under-review"
              >
                <Icon name="ClockIcon" size={10} />
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Card footer with actions */}
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
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="btn-primary text-xs py-1.5 px-3 no-print disabled:opacity-60"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Icon name="ArrowDownTrayIcon" size={13} />
                    Download PDF
                  </>
                )}
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
                description: 'Your uploaded documents will be verified against NIMC (NIN) and CAC databases. You may be contacted for additional documents.',
                status: 'pending',
                timeline: '3–7 working days',
              },
              {
                step: '04',
                title: 'Grant Eligibility Assessment',
                description: 'Your application is forwarded to the relevant partner agency (FMARD/IFAD/USAID/FAO) for grant eligibility assessment and final scoring.',
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
                      item.status === 'complete' ? 'bg-primary text-white'
                        : item.status === 'active' ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground border border-border',
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
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="w-full btn-primary justify-center text-sm disabled:opacity-60"
          >
            {isGeneratingPDF ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating PDF…
              </>
            ) : (
              <>
                <Icon name="ArrowDownTrayIcon" size={15} />
                Download Receipt (PDF)
              </>
            )}
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
            This portal is operated by the Federal Ministry of Agriculture and Rural Development (FMARD) in partnership with IFAD, USAID, FAO, AGRA, and international development partners. Applications are subject to the terms of the respective grant programme guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}