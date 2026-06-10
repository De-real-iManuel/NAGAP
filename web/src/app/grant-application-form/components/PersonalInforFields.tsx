import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { ApplicationFormData } from './ApplicationFormClient';

interface Props {
  register: UseFormRegister<ApplicationFormData>;
  errors: FieldErrors<ApplicationFormData>;
  states: string[];
}

export default function PersonalInfoFields({ register, errors, states }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {/* Full Name */}
      <div className="sm:col-span-2">
        <label htmlFor="farmerName" className="label-text">
          Full Legal Name <span className="text-red-500">*</span>
        </label>
        <p className="helper-text mb-1">Enter your name exactly as it appears on your NIN slip or international passport.</p>
        <input
          id="farmerName"
          type="text"
          autoComplete="name"
          placeholder="e.g. Adaeze Chidinma Okonkwo"
          {...register('farmerName', {
            required: 'Full legal name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
          className={`input-field ${errors.farmerName ? 'input-error' : ''}`}
        />
        {errors.farmerName && <p className="error-text">{errors.farmerName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="farmerEmail" className="label-text">
          Email Address <span className="text-red-500">*</span>
        </label>
        <p className="helper-text mb-1">A valid email address for correspondence and status updates.</p>
        <input
          id="farmerEmail"
          type="email"
          autoComplete="email"
          placeholder="e.g. adaeze.okonkwo@gmail.com"
          {...register('farmerEmail', {
            required: 'Email address is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
          className={`input-field ${errors.farmerEmail ? 'input-error' : ''}`}
        />
        {errors.farmerEmail && <p className="error-text">{errors.farmerEmail.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="farmerPhone" className="label-text">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <p className="helper-text mb-1">Nigerian mobile number (e.g. 08012345678 or +2348012345678)</p>
        <input
          id="farmerPhone"
          type="tel"
          autoComplete="tel"
          placeholder="e.g. 08012345678"
          {...register('farmerPhone', {
            required: 'Phone number is required',
            pattern: {
              value: /^(\+?234|0)[789][01]\d{8}$/,
              message: 'Enter a valid Nigerian phone number',
            },
          })}
          className={`input-field ${errors.farmerPhone ? 'input-error' : ''}`}
        />
        {errors.farmerPhone && <p className="error-text">{errors.farmerPhone.message}</p>}
      </div>

      {/* State */}
      <div>
        <label htmlFor="stateOfResidence" className="label-text">
          State of Residence <span className="text-red-500">*</span>
        </label>
        <p className="helper-text mb-1">Select the state where your farm is primarily located.</p>
        <select
          id="stateOfResidence"
          {...register('stateOfResidence', {
            required: 'Please select your state of residence',
          })}
          className={`input-field ${errors.stateOfResidence ? 'input-error' : ''}`}
        >
          <option value="">— Select State —</option>
          {states.map((state) => (
            <option key={`state-${state}`} value={state}>{state}</option>
          ))}
        </select>
        {errors.stateOfResidence && <p className="error-text">{errors.stateOfResidence.message}</p>}
      </div>

      {/* LGA */}
      <div>
        <label htmlFor="lga" className="label-text">
          Local Government Area (LGA) <span className="text-red-500">*</span>
        </label>
        <p className="helper-text mb-1">Enter the name of your LGA as it appears on official documents.</p>
        <input
          id="lga"
          type="text"
          placeholder="e.g. Onitsha North"
          {...register('lga', {
            required: 'LGA is required',
          })}
          className={`input-field ${errors.lga ? 'input-error' : ''}`}
        />
        {errors.lga && <p className="error-text">{errors.lga.message}</p>}
      </div>

      {/* Farm Location */}
      <div className="sm:col-span-2">
        <label htmlFor="farmLocation" className="label-text">
          Farm Address / Location Description <span className="text-red-500">*</span>
        </label>
        <p className="helper-text mb-1">Provide the full address or a detailed description of your farm&apos;s location, including nearest landmark.</p>
        <textarea
          id="farmLocation"
          rows={3}
          placeholder="e.g. Km 12 Onitsha–Owerri Road, behind Oguta Rice Mill, Oguta LGA, Imo State"
          {...register('farmLocation', {
            required: 'Farm location is required',
            minLength: { value: 10, message: 'Please provide a more detailed location description' },
          })}
          className={`input-field resize-none ${errors.farmLocation ? 'input-error' : ''}`}
        />
        {errors.farmLocation && <p className="error-text">{errors.farmLocation.message}</p>}
      </div>
    </div>
  );
}