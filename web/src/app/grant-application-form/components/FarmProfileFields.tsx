import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { ApplicationFormData } from './ApplicationFormClient';

interface CropOption {
  id: string;
  label: string;
}

interface Props {
  register: UseFormRegister<ApplicationFormData>;
  errors: FieldErrors<ApplicationFormData>;
  farmTypes: string[];
  cropOptions: CropOption[];
  selectedCrops: string[];
  onToggleCrop: (id: string) => void;
}

export default function FarmProfileFields({
  register,
  errors,
  farmTypes,
  cropOptions,
  selectedCrops,
  onToggleCrop,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Farm Type */}
        <div>
          <label htmlFor="farmType" className="label-text">
            Farm Type <span className="text-red-500">*</span>
          </label>
          <p className="helper-text mb-1">Select the primary type of farming activity on your farm.</p>
          <select
            id="farmType"
            {...register('farmType', { required: 'Please select a farm type' })}
            className={`input-field ${errors.farmType ? 'input-error' : ''}`}
          >
            <option value="">— Select Farm Type —</option>
            {farmTypes.map((type) => (
              <option key={`farmtype-${type}`} value={type}>{type}</option>
            ))}
          </select>
          {errors.farmType && <p className="error-text">{errors.farmType.message}</p>}
        </div>

        {/* Farm Size */}
        <div>
          <label htmlFor="farmSizeHectares" className="label-text">
            Farm Size (Hectares)
          </label>
          <p className="helper-text mb-1">Approximate total cultivated area in hectares. 1 hectare ≈ 2.47 acres.</p>
          <input
            id="farmSizeHectares"
            type="number"
            min="0"
            step="0.5"
            placeholder="e.g. 2.5"
            {...register('farmSizeHectares', {
              min: { value: 0.1, message: 'Farm size must be greater than 0' },
            })}
            className={`input-field ${errors.farmSizeHectares ? 'input-error' : ''}`}
          />
          {errors.farmSizeHectares && <p className="error-text">{errors.farmSizeHectares.message}</p>}
        </div>

        {/* Years in Operation */}
        <div>
          <label htmlFor="yearsInOperation" className="label-text">
            Years in Operation
          </label>
          <p className="helper-text mb-1">How many years have you been actively farming at this location?</p>
          <input
            id="yearsInOperation"
            type="number"
            min="0"
            max="99"
            placeholder="e.g. 7"
            {...register('yearsInOperation', {
              min: { value: 0, message: 'Value cannot be negative' },
              max: { value: 99, message: 'Please enter a valid number of years' },
            })}
            className={`input-field ${errors.yearsInOperation ? 'input-error' : ''}`}
          />
          {errors.yearsInOperation && <p className="error-text">{errors.yearsInOperation.message}</p>}
        </div>

        {/* Annual Revenue */}
        <div>
          <label htmlFor="annualRevenueNGN" className="label-text">
            Annual Revenue (₦ Naira)
          </label>
          <p className="helper-text mb-1">Estimated total farm revenue for the last 12 months in Nigerian Naira.</p>
          <input
            id="annualRevenueNGN"
            type="number"
            min="0"
            step="1000"
            placeholder="e.g. 850000"
            {...register('annualRevenueNGN', {
              min: { value: 0, message: 'Revenue cannot be negative' },
            })}
            className={`input-field ${errors.annualRevenueNGN ? 'input-error' : ''}`}
          />
          {errors.annualRevenueNGN && <p className="error-text">{errors.annualRevenueNGN.message}</p>}
          <p className="helper-text">Enter amount in full (e.g. 850000 for ₦850,000)</p>
        </div>
      </div>

      {/* Crops / Livestock — multi-select checkboxes */}
      <div>
        <label className="label-text mb-2 block">
          Crops / Livestock Produced
        </label>
        <p className="helper-text mb-3">Select all crops or livestock types your farm produces. Tick all that apply.</p>
        <div
          id="cropOrLivestockTypes"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2"
        >
          {cropOptions.map((crop) => (
            <label
              key={crop.id}
              htmlFor={crop.id}
              className="checkbox-item"
            >
              <input
                id={crop.id}
                type="checkbox"
                checked={selectedCrops.includes(crop.id)}
                onChange={() => onToggleCrop(crop.id)}
                className="mt-0"
              />
              <span className="text-sm font-medium text-foreground">{crop.label}</span>
            </label>
          ))}
        </div>
        {selectedCrops.length > 0 && (
          <p className="helper-text mt-2">
            Selected: {selectedCrops.length} item{selectedCrops.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
}