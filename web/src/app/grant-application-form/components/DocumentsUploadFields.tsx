'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';
import type { ApplicationFormData } from './ApplicationFormClient';
import Icon from '@/components/ui/AppIcon';

interface Props {
  register?: never;
  errors: FieldErrors<ApplicationFormData>;
  uploadedFiles: Record<string, File | null>;
  onFileChange: (fieldId: string, file: File | null) => void;
}

const documentFields = [
  {
    id: 'ninDocument',
    label: 'NIN Slip / NIMC Card',
    description: 'Upload a clear scan or photo of your National Identification Number (NIN) slip or NIMC card.',
    accept: '.pdf,.jpg,.jpeg,.png',
    required: true,
    maxSize: '5MB',
  },
  {
    id: 'cacDocument',
    label: 'CAC Certificate (if applicable)',
    description: 'Upload your Corporate Affairs Commission business registration certificate. Required only if you ticked CAC registration above.',
    accept: '.pdf',
    required: false,
    maxSize: '5MB',
  },
  {
    id: 'bankStatement',
    label: 'Bank Statement (Last 6 Months)',
    description: 'Upload a bank statement covering the last 6 months from your primary business account. Must show account name and number.',
    accept: '.pdf',
    required: true,
    maxSize: '5MB',
  },
  {
    id: 'landDocument',
    label: 'Land Document (C of O / R of O / Survey Plan)',
    description: 'Upload your Certificate of Occupancy, Right of Occupancy, or Survey Plan if available. Improves eligibility scoring.',
    accept: '.pdf,.jpg,.jpeg,.png',
    required: false,
    maxSize: '5MB',
  },
];

export default function DocumentUploadFields({ uploadedFiles, onFileChange, errors }: Props) {
  const { register } = useFormContext<ApplicationFormData>();
  const handleFileInput = (fieldId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file && file.size > 5 * 1024 * 1024) {
      alert(`File "${file.name}" exceeds the 5MB limit. Please compress or use a smaller file.`);
      event.target.value = '';
      return;
    }
    onFileChange(fieldId, file);
  };

  return (
    <div className="space-y-5">
      {/* Document upload grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documentFields.map((doc) => {
          const file = uploadedFiles[doc.id];
          return (
            <div key={`doc-${doc.id}`}>
              <label htmlFor={doc.id} className="label-text">
                {doc.label}
                {doc.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <p className="helper-text mb-2">{doc.description}</p>

              <label
                htmlFor={doc.id}
                className={`file-upload-zone block cursor-pointer ${file ? 'has-file' : ''}`}
              >
                <input
                  id={doc.id}
                  type="file"
                  accept={doc.accept}
                  className="sr-only"
                  onChange={(e) => handleFileInput(doc.id, e)}
                />
                {file ? (
                  <div className="flex items-center gap-2 justify-center">
                    <Icon name="DocumentCheckIcon" size={16} className="text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-primary truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB · Click to replace
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Icon name="ArrowUpTrayIcon" size={20} className="text-muted-foreground mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag &amp; drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {doc.accept.replace(/\./g, '').replace(/,/g, ', ').toUpperCase()} · Max {doc.maxSize}
                    </p>
                  </div>
                )}
              </label>
            </div>
          );
        })}
      </div>

      {/* Additional Notes */}
      <div>
        <label htmlFor="additionalNotes" className="label-text">
          Additional Notes (Optional)
        </label>
        <p className="helper-text mb-1">
          Provide any additional information that may support your application — e.g. cooperative membership details, previous grant history, or special circumstances.
        </p>
        <textarea
          id="additionalNotes"
          rows={4}
          placeholder="Optional: Any additional information you wish to provide to support your application..."
          {...register('additionalNotes')}
          className="input-field resize-none"
        />
      </div>

      {/* Document checklist notice */}
      <div className="bg-muted border border-border rounded p-4">
        <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1">
          <Icon name="ClipboardDocumentListIcon" size={14} className="text-primary" />
          Document Submission Checklist
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {[
            'NIN Slip or NIMC Card — Required',
            'Bank Statement (6 months) — Required',
            'CAC Certificate — If applicable',
            'Land Document — If available',
            'Passport Photograph — Optional',
            'Cooperative ID Card — If applicable',
          ].map((item, idx) => (
            <div key={`doccheck-${idx}`} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon name="ChevronRightIcon" size={10} className="text-primary" />
              {item}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          Note: Documents are stored securely on government servers. You will be contacted if additional documents are required during the verification process.
        </p>
      </div>
    </div>
  );
}