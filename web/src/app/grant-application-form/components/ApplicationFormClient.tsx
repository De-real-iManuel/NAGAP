'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { NIGERIAN_STATES, GRANT_PROGRAMS, FARM_TYPES, CROP_LIVESTOCK_OPTIONS } from '@/lib/utils';
import FormSection from './FormSection';

export type ApplicationFormData = {
  farmerName: string;
  farmerEmail: string;
  farmerPhone: string;
  stateOfResidence: string;
  lga: string;
  farmLocation: string;
  farmType: string;
  farmSizeHectares: string;
  yearsInOperation: string;
  annualRevenueNGN: string;
  grantProgram: string;
  requestedFundingAmountNGN: string;
  proposedProjectDescription: string;
  hasBVN: boolean;
  hasCACRegistration: boolean;
  isMemberOfCooperative: boolean;
  hasLandDocument: boolean;
  isSmallholderFarmer: boolean;
  isYouthFarmer: boolean;
  isWomanFarmer: boolean;
  hasExistingLoanDefault: boolean;
  additionalNotes: string;
  declarationAgreed: boolean;
};

type FormErrors = Partial<Record<keyof ApplicationFormData, string>>;

const INITIAL_FORM: ApplicationFormData = {
  farmerName: '',
  farmerEmail: '',
  farmerPhone: '',
  stateOfResidence: '',
  lga: '',
  farmLocation: '',
  farmType: '',
  farmSizeHectares: '',
  yearsInOperation: '',
  annualRevenueNGN: '',
  grantProgram: '',
  requestedFundingAmountNGN: '',
  proposedProjectDescription: '',
  hasBVN: false,
  hasCACRegistration: false,
  isMemberOfCooperative: false,
  hasLandDocument: false,
  isSmallholderFarmer: false,
  isYouthFarmer: false,
  isWomanFarmer: false,
  hasExistingLoanDefault: false,
  additionalNotes: '',
  declarationAgreed: false,
};

const COMPLIANCE_ITEMS = [
  { id: 'hasBVN' as keyof ApplicationFormData, label: 'I have a Bank Verification Number (BVN)', description: 'A BVN is required for all applicants. Contact any Nigerian bank branch to enrol.', required: true, icon: 'FingerPrintIcon', isWarning: false },
  { id: 'hasCACRegistration' as keyof ApplicationFormData, label: 'My business is registered with the Corporate Affairs Commission (CAC)', description: 'Required for NIRSAL AGSMEIS and BOA SME loans. Not required for individual smallholder applications.', required: false, icon: 'BuildingOfficeIcon', isWarning: false },
  { id: 'isMemberOfCooperative' as keyof ApplicationFormData, label: 'I am a member of a registered cooperative society', description: 'Cooperative membership improves eligibility for CBN Anchor Borrowers Programme.', required: false, icon: 'UsersIcon', isWarning: false },
  { id: 'hasLandDocument' as keyof ApplicationFormData, label: 'I have a valid land document (Certificate of Occupancy / Right of Occupancy / Survey Plan)', description: 'Land documentation strengthens your application. Upload in Section 5 below.', required: false, icon: 'DocumentTextIcon', isWarning: false },
  { id: 'isSmallholderFarmer' as keyof ApplicationFormData, label: 'I am a smallholder farmer (farm size under 5 hectares)', description: 'Smallholder status qualifies you for dedicated smallholder support programmes.', required: false, icon: 'HomeModernIcon', isWarning: false },
  { id: 'isYouthFarmer' as keyof ApplicationFormData, label: 'I am a youth farmer (aged 18–35 years)', description: 'Youth farmers receive priority consideration and higher grant allocations under FMARD APPEALS.', required: false, icon: 'AcademicCapIcon', isWarning: false },
  { id: 'isWomanFarmer' as keyof ApplicationFormData, label: 'I am a woman farmer / my farm is woman-led', description: 'Women-led farms receive dedicated support and quota allocations across all active grant programmes.', required: false, icon: 'HeartIcon', isWarning: false },
  { id: 'hasExistingLoanDefault' as keyof ApplicationFormData, label: 'I have an existing loan default recorded on the Credit Risk Management System (CRMS)', description: 'Applicants with existing defaults may still apply but will be subject to additional review.', required: false, icon: 'ExclamationTriangleIcon', isWarning: true },
];

const DOCUMENT_FIELDS = [
  { id: 'ninDocument', label: 'NIN Slip / NIMC Card', description: 'Upload a clear scan or photo of your National Identification Number (NIN) slip or NIMC card.', accept: '.pdf,.jpg,.jpeg,.png', required: true, maxSize: '5MB' },
  { id: 'cacDocument', label: 'CAC Certificate (if applicable)', description: 'Upload your Corporate Affairs Commission business registration certificate.', accept: '.pdf', required: false, maxSize: '5MB' },
  { id: 'bankStatement', label: 'Bank Statement (Last 6 Months)', description: 'Upload a bank statement covering the last 6 months from your primary business account.', accept: '.pdf', required: true, maxSize: '5MB' },
  { id: 'landDocument', label: 'Land Document (C of O / R of O / Survey Plan)', description: 'Upload your Certificate of Occupancy, Right of Occupancy, or Survey Plan if available.', accept: '.pdf,.jpg,.jpeg,.png', required: false, maxSize: '5MB' },
];

const PROGRAM_MAX_AMOUNTS: Record<string, string> = {
  'CBN Anchor Borrowers Programme': '₦5,000,000',
  'NIRSAL AGSMEIS': '₦10,000,000',
  'BOA Micro-Agriculture Loan': '₦1,500,000',
  'BOA Small/Medium Agriculture Loan': '₦50,000,000',
  'FMARD APPEALS': '₦3,000,000',
  'IFAD VCDP': '₦2,500,000',
  'State Ministry Program': 'Varies by state',
};

export default function ApplicationFormClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({
    ninDocument: null,
    cacDocument: null,
    bankStatement: null,
    landDocument: null,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name as keyof ApplicationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleCrop = (cropId: string) => {
    setSelectedCrops((prev) =>
      prev.includes(cropId) ? prev.filter((c) => c !== cropId) : [...prev, cropId]
    );
  };

  const handleFileChange = (fieldId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file && file.size > 5 * 1024 * 1024) {
      alert(`File "${file.name}" exceeds the 5MB limit. Please compress or use a smaller file.`);
      event.target.value = '';
      return;
    }
    setUploadedFiles((prev) => ({ ...prev, [fieldId]: file }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.farmerName.trim() || formData.farmerName.trim().length < 2) newErrors.farmerName = 'Full legal name is required (min 2 characters)';
    if (!formData.farmerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.farmerEmail)) newErrors.farmerEmail = 'A valid email address is required';
    if (!formData.farmerPhone.trim()) newErrors.farmerPhone = 'Phone number is required';
    if (!formData.stateOfResidence) newErrors.stateOfResidence = 'Please select your state of residence';
    if (!formData.lga.trim()) newErrors.lga = 'LGA is required';
    if (!formData.farmLocation.trim() || formData.farmLocation.trim().length < 10) newErrors.farmLocation = 'Please provide a detailed farm location (min 10 characters)';
    if (!formData.farmType) newErrors.farmType = 'Please select a farm type';
    if (!formData.grantProgram) newErrors.grantProgram = 'Please select a grant programme';
    if (!formData.requestedFundingAmountNGN || Number(formData.requestedFundingAmountNGN) < 10000) newErrors.requestedFundingAmountNGN = 'Requested funding amount is required (minimum ₦10,000)';
    if (!formData.proposedProjectDescription.trim() || formData.proposedProjectDescription.trim().length < 100) newErrors.proposedProjectDescription = 'Project description must be at least 100 characters';
    if (!formData.declarationAgreed) newErrors.declarationAgreed = 'You must agree to the declaration before submitting';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) {
      const firstError = formRef.current?.querySelector('[data-error="true"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        farmerName: formData.farmerName,
        farmerEmail: formData.farmerEmail,
        farmerPhone: formData.farmerPhone,
        stateOfResidence: formData.stateOfResidence,
        lga: formData.lga,
        farmLocation: formData.farmLocation,
        farmType: formData.farmType,
        farmSizeHectares: formData.farmSizeHectares ? Number(formData.farmSizeHectares) : undefined,
        cropOrLivestockTypes: selectedCrops,
        yearsInOperation: formData.yearsInOperation ? Number(formData.yearsInOperation) : undefined,
        annualRevenueNGN: formData.annualRevenueNGN ? Number(formData.annualRevenueNGN) : undefined,
        grantProgram: formData.grantProgram,
        requestedFundingAmountNGN: Number(formData.requestedFundingAmountNGN),
        proposedProjectDescription: formData.proposedProjectDescription,
        hasBVN: formData.hasBVN,
        hasCACRegistration: formData.hasCACRegistration,
        isMemberOfCooperative: formData.isMemberOfCooperative,
        hasLandDocument: formData.hasLandDocument,
        isSmallholderFarmer: formData.isSmallholderFarmer,
        isYouthFarmer: formData.isYouthFarmer,
        isWomanFarmer: formData.isWomanFarmer,
        hasExistingLoanDefault: formData.hasExistingLoanDefault,
        additionalNotes: formData.additionalNotes,
        documents: {
          ninDocument: uploadedFiles.ninDocument?.name ?? null,
          cacDocument: uploadedFiles.cacDocument?.name ?? null,
          bankStatement: uploadedFiles.bankStatement?.name ?? null,
          landDocument: uploadedFiles.landDocument?.name ?? null,
        },
      };

      const response = await fetch('/api/v1/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Submission failed');
      }

      sessionStorage.setItem(
        'nagap_submission',
        JSON.stringify({
          applicationReference: result.applicationReference,
          farmerName: result.farmerName,
          grantProgram: result.grantProgram,
          submittedAt: result.submittedAt,
          status: result.status,
          requestedFundingAmountNGN: payload.requestedFundingAmountNGN,
          stateOfResidence: payload.stateOfResidence,
        })
      );

      router.push('/success-confirmation-page');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setSubmitError(`Submission failed: ${message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: keyof ApplicationFormData) =>
    `input-field ${errors[field] ? 'input-error' : ''}`;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Sticky sidebar */}
      <div className="xl:col-span-1 hidden xl:block">
        <div className="sticky top-20">
          <div className="bg-white border border-border rounded p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Form Sections</p>
            <nav className="space-y-1">
              {[
                { id: 'section-personal', label: 'Personal & Farm Info', num: '01' },
                { id: 'section-farmprofile', label: 'Farm Profile', num: '02' },
                { id: 'section-grantrequest', label: 'Grant Request', num: '03' },
                { id: 'section-compliance', label: 'Compliance Checklist', num: '04' },
                { id: 'section-documents', label: 'Documents & Declaration', num: '05' },
              ].map((section) => (
                <a key={`sidebar-${section.id}`} href={`#${section.id}`} className="flex items-center gap-2 px-3 py-2 rounded text-sm text-muted-foreground hover:bg-primary-light hover:text-primary transition-colors">
                  <span className="w-5 h-5 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{section.num}</span>
                  {section.label}
                </a>
              ))}
            </nav>
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2 font-semibold">Application Deadline</p>
              <p className="text-sm font-bold text-red-600">31 August 2026</p>
              <p className="text-xs text-muted-foreground mt-1">Applications submitted after this date will not be processed.</p>
            </div>
            <div className="mt-4 bg-primary-light border border-primary/20 rounded p-3">
              <p className="text-xs text-primary font-semibold mb-1">Need Help?</p>
              <p className="text-xs text-muted-foreground">Call: 0800-624-27-64<br />Email: support@nagap.gov.ng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main form */}
      <div className="xl:col-span-3">
        <form ref={formRef} id="nagapApplicationForm" onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* Section 1 — Personal & Farm Information */}
          <div id="section-personal">
            <FormSection number="Section 1" title="Personal &amp; Farm Information" subtitle="Enter your personal details exactly as they appear on your official identification documents.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2" data-error={!!errors.farmerName}>
                  <label htmlFor="farmerName" className="label-text">Full Legal Name <span className="text-red-500">*</span></label>
                  <p className="helper-text mb-1">Enter your name exactly as it appears on your NIN slip or international passport.</p>
                  <input id="farmerName" name="farmerName" type="text" autoComplete="name" placeholder="e.g. Adaeze Chidinma Okonkwo" value={formData.farmerName} onChange={handleChange} className={inputClass('farmerName')} />
                  {errors.farmerName && <p className="error-text">{errors.farmerName}</p>}
                </div>
                <div data-error={!!errors.farmerEmail}>
                  <label htmlFor="farmerEmail" className="label-text">Email Address <span className="text-red-500">*</span></label>
                  <p className="helper-text mb-1">A valid email address for correspondence and status updates.</p>
                  <input id="farmerEmail" name="farmerEmail" type="email" autoComplete="email" placeholder="e.g. adaeze.okonkwo@gmail.com" value={formData.farmerEmail} onChange={handleChange} className={inputClass('farmerEmail')} />
                  {errors.farmerEmail && <p className="error-text">{errors.farmerEmail}</p>}
                </div>
                <div data-error={!!errors.farmerPhone}>
                  <label htmlFor="farmerPhone" className="label-text">Phone Number <span className="text-red-500">*</span></label>
                  <p className="helper-text mb-1">Nigerian mobile number (e.g. 08012345678 or +2348012345678)</p>
                  <input id="farmerPhone" name="farmerPhone" type="tel" autoComplete="tel" placeholder="e.g. 08012345678" value={formData.farmerPhone} onChange={handleChange} className={inputClass('farmerPhone')} />
                  {errors.farmerPhone && <p className="error-text">{errors.farmerPhone}</p>}
                </div>
                <div data-error={!!errors.stateOfResidence}>
                  <label htmlFor="stateOfResidence" className="label-text">State of Residence <span className="text-red-500">*</span></label>
                  <p className="helper-text mb-1">Select the state where your farm is primarily located.</p>
                  <select id="stateOfResidence" name="stateOfResidence" value={formData.stateOfResidence} onChange={handleChange} className={inputClass('stateOfResidence')}>
                    <option value="">— Select State —</option>
                    {NIGERIAN_STATES.map((state) => <option key={`state-${state}`} value={state}>{state}</option>)}
                  </select>
                  {errors.stateOfResidence && <p className="error-text">{errors.stateOfResidence}</p>}
                </div>
                <div data-error={!!errors.lga}>
                  <label htmlFor="lga" className="label-text">Local Government Area (LGA) <span className="text-red-500">*</span></label>
                  <p className="helper-text mb-1">Enter the name of your LGA as it appears on official documents.</p>
                  <input id="lga" name="lga" type="text" placeholder="e.g. Onitsha North" value={formData.lga} onChange={handleChange} className={inputClass('lga')} />
                  {errors.lga && <p className="error-text">{errors.lga}</p>}
                </div>
                <div className="sm:col-span-2" data-error={!!errors.farmLocation}>
                  <label htmlFor="farmLocation" className="label-text">Farm Address / Location Description <span className="text-red-500">*</span></label>
                  <p className="helper-text mb-1">Provide the full address or a detailed description of your farm&apos;s location, including nearest landmark.</p>
                  <textarea id="farmLocation" name="farmLocation" rows={3} placeholder="e.g. Km 12 Onitsha–Owerri Road, behind Oguta Rice Mill, Oguta LGA, Imo State" value={formData.farmLocation} onChange={handleChange} className={`input-field resize-none ${errors.farmLocation ? 'input-error' : ''}`} />
                  {errors.farmLocation && <p className="error-text">{errors.farmLocation}</p>}
                </div>
              </div>
            </FormSection>
          </div>

          {/* Section 2 — Farm Profile */}
          <div id="section-farmprofile">
            <FormSection number="Section 2" title="Farm Profile" subtitle="Provide accurate details about your farm operation. This information is used to determine eligibility.">
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div data-error={!!errors.farmType}>
                    <label htmlFor="farmType" className="label-text">Farm Type <span className="text-red-500">*</span></label>
                    <p className="helper-text mb-1">Select the primary type of farming activity on your farm.</p>
                    <select id="farmType" name="farmType" value={formData.farmType} onChange={handleChange} className={inputClass('farmType')}>
                      <option value="">— Select Farm Type —</option>
                      {FARM_TYPES.map((type) => <option key={`farmtype-${type}`} value={type}>{type}</option>)}
                    </select>
                    {errors.farmType && <p className="error-text">{errors.farmType}</p>}
                  </div>
                  <div>
                    <label htmlFor="farmSizeHectares" className="label-text">Farm Size (Hectares)</label>
                    <p className="helper-text mb-1">Approximate total cultivated area in hectares. 1 hectare ≈ 2.47 acres.</p>
                    <input id="farmSizeHectares" name="farmSizeHectares" type="number" min="0" step="0.5" placeholder="e.g. 2.5" value={formData.farmSizeHectares} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="yearsInOperation" className="label-text">Years in Operation</label>
                    <p className="helper-text mb-1">How many years have you been actively farming at this location?</p>
                    <input id="yearsInOperation" name="yearsInOperation" type="number" min="0" max="99" placeholder="e.g. 7" value={formData.yearsInOperation} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="annualRevenueNGN" className="label-text">Annual Revenue (₦ Naira)</label>
                    <p className="helper-text mb-1">Estimated total farm revenue for the last 12 months in Nigerian Naira.</p>
                    <input id="annualRevenueNGN" name="annualRevenueNGN" type="number" min="0" step="1000" placeholder="e.g. 850000" value={formData.annualRevenueNGN} onChange={handleChange} className="input-field" />
                    <p className="helper-text">Enter amount in full (e.g. 850000 for ₦850,000)</p>
                  </div>
                </div>
                <div>
                  <label className="label-text mb-2 block">Crops / Livestock Produced</label>
                  <p className="helper-text mb-3">Select all crops or livestock types your farm produces. Tick all that apply.</p>
                  <div id="cropOrLivestockTypes" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {CROP_LIVESTOCK_OPTIONS.map((crop) => (
                      <label key={crop.id} htmlFor={crop.id} className="checkbox-item">
                        <input id={crop.id} type="checkbox" checked={selectedCrops.includes(crop.id)} onChange={() => toggleCrop(crop.id)} className="mt-0" />
                        <span className="text-sm font-medium text-foreground">{crop.label}</span>
                      </label>
                    ))}
                  </div>
                  {selectedCrops.length > 0 && <p className="helper-text mt-2">Selected: {selectedCrops.length} item{selectedCrops.length !== 1 ? 's' : ''}</p>}
                </div>
              </div>
            </FormSection>
          </div>

          {/* Section 3 — Grant Request */}
          <div id="section-grantrequest">
            <FormSection number="Section 3" title="Grant Request" subtitle="Specify the grant programme you are applying for and provide a detailed project description.">
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div data-error={!!errors.grantProgram}>
                    <label htmlFor="grantProgram" className="label-text">Grant Programme Applying For <span className="text-red-500">*</span></label>
                    <p className="helper-text mb-1">Select the specific government programme for this application.</p>
                    <select id="grantProgram" name="grantProgram" value={formData.grantProgram} onChange={handleChange} className={inputClass('grantProgram')}>
                      <option value="">— Select Grant Programme —</option>
                      {GRANT_PROGRAMS.map((prog) => <option key={`prog-${prog}`} value={prog}>{prog}</option>)}
                    </select>
                    {errors.grantProgram && <p className="error-text">{errors.grantProgram}</p>}
                  </div>
                  <div data-error={!!errors.requestedFundingAmountNGN}>
                    <label htmlFor="requestedFundingAmountNGN" className="label-text">Requested Funding Amount (₦ Naira) <span className="text-red-500">*</span></label>
                    <p className="helper-text mb-1">Enter the total amount you are requesting. Must not exceed the programme maximum.</p>
                    <input id="requestedFundingAmountNGN" name="requestedFundingAmountNGN" type="number" min="10000" step="1000" placeholder="e.g. 2500000" value={formData.requestedFundingAmountNGN} onChange={handleChange} className={inputClass('requestedFundingAmountNGN')} />
                    {errors.requestedFundingAmountNGN && <p className="error-text">{errors.requestedFundingAmountNGN}</p>}
                    <p className="helper-text">Enter amount in full Naira (e.g. 2500000 for ₦2,500,000)</p>
                  </div>
                </div>
                <div className="bg-muted border border-border rounded p-3">
                  <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1">
                    <Icon name="InformationCircleIcon" size={14} className="text-primary" />
                    Programme Maximum Funding Limits
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {Object.entries(PROGRAM_MAX_AMOUNTS).map(([prog, max]) => (
                      <div key={`maxamt-${prog}`} className="bg-white rounded px-2 py-1.5 border border-border">
                        <p className="text-xs text-muted-foreground leading-tight truncate" title={prog}>{prog}</p>
                        <p className="text-sm font-bold text-primary tabular-nums">{max}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div data-error={!!errors.proposedProjectDescription}>
                  <label htmlFor="proposedProjectDescription" className="label-text">Proposed Project Description <span className="text-red-500">*</span></label>
                  <p className="helper-text mb-1">Describe in detail how you plan to use the grant funding. Include: specific activities, timeline, expected output, and how the funding will improve your farm&apos;s productivity. Minimum 100 characters.</p>
                  <textarea id="proposedProjectDescription" name="proposedProjectDescription" rows={6} placeholder="Example: I plan to use the requested ₦2,500,000 to expand my rice cultivation from 2 hectares to 5 hectares in Onitsha North LGA, Anambra State..." value={formData.proposedProjectDescription} onChange={handleChange} className={`input-field resize-y ${errors.proposedProjectDescription ? 'input-error' : ''}`} />
                  {errors.proposedProjectDescription && <p className="error-text">{errors.proposedProjectDescription}</p>}
                </div>
              </div>
            </FormSection>
          </div>

          {/* Section 4 — Compliance Checklist */}
          <div id="section-compliance">
            <FormSection number="Section 4" title="Compliance Checklist" subtitle="Tick all statements that apply to you. These determine your eligibility for specific programmes.">
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <Icon name="InformationCircleIcon" size={14} className="inline mr-1 text-blue-600" />
                    <strong>Instructions:</strong> Tick each item that accurately applies to your situation. All declarations are verified against government databases before disbursement.
                  </p>
                </div>
                {COMPLIANCE_ITEMS.map((item) => (
                  <div key={`compliance-${item.id}`} className={`checkbox-item ${item.isWarning ? 'border-amber-300 bg-amber-50 hover:bg-amber-100' : ''}`}>
                    <input id={item.id} name={item.id} type="checkbox" checked={formData[item.id] as boolean} onChange={handleChange} />
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={14} className={`mt-0.5 flex-shrink-0 ${item.isWarning ? 'text-amber-600' : 'text-primary'}`} />
                        <div>
                          <label htmlFor={item.id} className="text-sm font-semibold text-foreground cursor-pointer">
                            {item.label}
                            {item.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-primary-light border border-primary/20 rounded p-3 mt-4">
                  <p className="text-xs text-primary leading-relaxed">
                    <Icon name="ShieldCheckIcon" size={14} className="inline mr-1" />
                    <strong>Data Protection Notice:</strong> Information provided will be cross-referenced with NIMC (NIN), CBN CRMS, CAC, and NIRSAL databases. Your data is protected under NDPR 2019.
                  </p>
                </div>
              </div>
            </FormSection>
          </div>

          {/* Section 5 — Document Upload & Declaration */}
          <div id="section-documents">
            <FormSection number="Section 5" title="Document Upload &amp; Declaration" subtitle="Upload scanned copies of required documents. Accepted formats: PDF, JPG, PNG. Max file size: 5MB each.">
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DOCUMENT_FIELDS.map((doc) => {
                    const file = uploadedFiles[doc.id];
                    return (
                      <div key={`doc-${doc.id}`}>
                        <label htmlFor={doc.id} className="label-text">
                          {doc.label}
                          {doc.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <p className="helper-text mb-2">{doc.description}</p>
                        <label htmlFor={doc.id} className={`file-upload-zone block cursor-pointer ${file ? 'has-file' : ''}`}>
                          <input id={doc.id} name={doc.id} type="file" accept={doc.accept} className="sr-only" onChange={(e) => handleFileChange(doc.id, e)} />
                          {file ? (
                            <div className="flex items-center gap-2 justify-center">
                              <Icon name="DocumentCheckIcon" size={16} className="text-primary" />
                              <div className="text-left">
                                <p className="text-sm font-semibold text-primary truncate max-w-[200px]">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB · Click to replace</p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <Icon name="ArrowUpTrayIcon" size={20} className="text-muted-foreground mx-auto mb-1" />
                              <p className="text-sm text-muted-foreground">Click to upload or drag &amp; drop</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{doc.accept.replace(/\./g, '').replace(/,/g, ', ').toUpperCase()} · Max {doc.maxSize}</p>
                            </div>
                          )}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <label htmlFor="additionalNotes" className="label-text">Additional Notes (Optional)</label>
                  <p className="helper-text mb-1">Provide any additional information that may support your application.</p>
                  <textarea id="additionalNotes" name="additionalNotes" rows={4} placeholder="Optional: Any additional information you wish to provide to support your application..." value={formData.additionalNotes} onChange={handleChange} className="input-field resize-none" />
                </div>
                <div className="bg-muted border border-border rounded p-4">
                  <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1">
                    <Icon name="ClipboardDocumentListIcon" size={14} className="text-primary" />
                    Document Submission Checklist
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {['NIN Slip or NIMC Card — Required', 'Bank Statement (6 months) — Required', 'CAC Certificate — If applicable', 'Land Document — If available', 'Passport Photograph — Optional', 'Cooperative ID Card — If applicable'].map((item, idx) => (
                      <div key={`doccheck-${idx}`} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Icon name="ChevronRightIcon" size={10} className="text-primary" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FormSection>
          </div>

          {/* Declaration */}
          <div className="bg-amber-50 border border-amber-300 rounded p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input id="declarationAgreed" name="declarationAgreed" type="checkbox" checked={formData.declarationAgreed} onChange={handleChange} className="mt-1 w-4 h-4 flex-shrink-0" style={{ accentColor: 'var(--primary)' }} />
              <div>
                <p className="text-sm font-bold text-amber-900">Statutory Declaration (Required)</p>
                <p className="text-xs text-amber-800 leading-relaxed mt-1">
                  I hereby declare that all information provided in this application is true, accurate, and complete to the best of my knowledge. I understand that submission of false or misleading information constitutes a criminal offence under Nigerian law and may result in immediate disqualification, recovery of any disbursed funds, and prosecution. I authorise the Federal Ministry of Agriculture and Rural Development (FMARD) and its partner agencies to verify any information provided herein.
                </p>
                {errors.declarationAgreed && <p className="error-text mt-2">{errors.declarationAgreed}</p>}
              </div>
            </label>
          </div>

          {/* Submit error */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-sm text-red-700 flex items-start gap-2">
                <Icon name="ExclamationCircleIcon" size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                {submitError}
              </p>
            </div>
          )}

          {/* Submit button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-t border-border">
            <button id="submitApplication" type="submit" disabled={isSubmitting} className="btn-primary text-base px-10 py-3 min-w-[220px] justify-center">
              {isSubmitting ? (
                <>
                  <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                  Submitting Application…
                </>
              ) : (
                <>
                  <Icon name="PaperAirplaneIcon" size={16} />
                  Submit Application
                </>
              )}
            </button>
            <div>
              <p className="text-xs text-muted-foreground">
                <Icon name="LockClosedIcon" size={12} className="inline mr-1 text-primary" />
                Your data is encrypted and securely transmitted via TLS 1.3
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">You will receive a confirmation email and SMS upon successful submission.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}