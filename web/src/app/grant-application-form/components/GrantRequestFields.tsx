import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { ApplicationFormData } from './ApplicationFormClient';
import Icon from '@/components/ui/AppIcon';

interface Props {
  register: UseFormRegister<ApplicationFormData>;
  errors: FieldErrors<ApplicationFormData>;
  grantPrograms: string[];
}

const programMaxAmounts: Record<string, string> = {
  'IFAD VCDP Grant (International Fund for Agricultural Development)': '₦5,000,000',
  'FMARD APPEALS Grant (FG / World Bank)': '₦6,000,000',
  'USAID Feed the Future Grant': '₦10,000,000',
  'Bill & Melinda Gates Foundation Agriculture Grant': '₦15,000,000',
  'AGRA Smallholder Farmer Empowerment Grant': '₦8,000,000',
  'FAO Smallholder Agricultural Grant (UN)': '₦4,500,000',
  'State Ministry Agricultural Development Grant': '₦3,000,000',
};

export default function GrantRequestFields({ register, errors, grantPrograms }: Props) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Grant Program */}
        <div>
          <label htmlFor="grantProgram" className="label-text">
            Grant Programme Applying For <span className="text-red-500">*</span>
          </label>
          <p className="helper-text mb-1">Select the specific government programme for this application. You may submit separate applications for different programmes.</p>
          <select
            id="grantProgram"
            {...register('grantProgram', { required: 'Please select a grant programme' })}
            className={`input-field ${errors.grantProgram ? 'input-error' : ''}`}
          >
            <option value="">— Select Grant Programme —</option>
            {grantPrograms.map((prog) => (
              <option key={`prog-${prog}`} value={prog}>{prog}</option>
            ))}
          </select>
          {errors.grantProgram && <p className="error-text">{errors.grantProgram.message}</p>}
        </div>

        {/* Requested Funding Amount */}
        <div>
          <label htmlFor="requestedFundingAmountNGN" className="label-text">
            Requested Funding Amount (₦ Naira) <span className="text-red-500">*</span>
          </label>
          <p className="helper-text mb-1">Enter the total amount you are requesting. Must not exceed the programme maximum.</p>
          <input
            id="requestedFundingAmountNGN"
            type="number"
            min="10000"
            step="1000"
            placeholder="e.g. 2500000"
            {...register('requestedFundingAmountNGN', {
              required: 'Requested funding amount is required',
              min: { value: 10000, message: 'Minimum request is ₦10,000' },
            })}
            className={`input-field ${errors.requestedFundingAmountNGN ? 'input-error' : ''}`}
          />
          {errors.requestedFundingAmountNGN && (
            <p className="error-text">{errors.requestedFundingAmountNGN.message}</p>
          )}
          <p className="helper-text">Enter amount in full Naira (e.g. 2500000 for ₦2,500,000)</p>
        </div>
      </div>

      {/* Programme maximum amounts reference */}
      <div className="bg-muted border border-border rounded p-3">
        <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1">
          <Icon name="InformationCircleIcon" size={14} className="text-primary" />
          Programme Maximum Funding Limits
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {Object.entries(programMaxAmounts).map(([prog, max]) => (
            <div key={`maxamt-${prog}`} className="bg-white rounded px-2 py-1.5 border border-border">
              <p className="text-xs text-muted-foreground leading-tight truncate" title={prog}>{prog}</p>
              <p className="text-sm font-bold text-primary tabular-nums">{max}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Project Description */}
      <div>
        <label htmlFor="proposedProjectDescription" className="label-text">
          Proposed Project Description <span className="text-red-500">*</span>
        </label>
        <p className="helper-text mb-1">
          Describe in detail how you plan to use the grant funding. Include: specific activities, timeline, expected output, and how the funding will improve your farm&apos;s productivity. Minimum 100 characters.
        </p>
        <textarea
          id="proposedProjectDescription"
          rows={6}
          placeholder="Example: I plan to use the requested ₦2,500,000 to expand my rice cultivation from 2 hectares to 5 hectares in Onitsha North LGA, Anambra State. The funds will be used to purchase improved seedlings (FARO 44 variety), fertiliser (NPK 15-15-15), and irrigation equipment. The project will create employment for 8 additional farm workers during planting and harvest seasons..."
          {...register('proposedProjectDescription', {
            required: 'Project description is required',
            minLength: {
              value: 100,
              message: 'Description must be at least 100 characters. Please provide more detail.',
            },
          })}
          className={`input-field resize-y ${errors.proposedProjectDescription ? 'input-error' : ''}`}
        />
        {errors.proposedProjectDescription && (
          <p className="error-text">{errors.proposedProjectDescription.message}</p>
        )}
      </div>
    </div>
  );
}