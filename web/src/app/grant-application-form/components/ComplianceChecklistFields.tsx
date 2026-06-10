'use client';

import React from 'react';

import type { ApplicationFormData } from './ApplicationFormClient';
import Icon from '@/components/ui/AppIcon';

interface Props {
  register: (name: keyof ApplicationFormData) => object;
}

const checklistItems = [
  {
    id: 'hasBVN' as keyof ApplicationFormData,
    label: 'I have a Bank Verification Number (BVN)',
    description: 'A BVN is required for all applicants. Contact any Nigerian bank branch to enrol.',
    required: true,
    icon: 'FingerPrintIcon',
  },
  {
    id: 'hasCACRegistration' as keyof ApplicationFormData,
    label: 'My business is registered with the Corporate Affairs Commission (CAC)',
    description: 'Required for NIRSAL AGSMEIS and BOA SME loans. Not required for individual smallholder applications.',
    required: false,
    icon: 'BuildingOfficeIcon',
  },
  {
    id: 'isMemberOfCooperative' as keyof ApplicationFormData,
    label: 'I am a member of a registered cooperative society',
    description: 'Cooperative membership improves eligibility for CBN Anchor Borrowers Programme. Provide cooperative registration number.',
    required: false,
    icon: 'UsersIcon',
  },
  {
    id: 'hasLandDocument' as keyof ApplicationFormData,
    label: 'I have a valid land document (Certificate of Occupancy / Right of Occupancy / Survey Plan)',
    description: 'Land documentation strengthens your application. Upload in Section 5 below.',
    required: false,
    icon: 'DocumentTextIcon',
  },
  {
    id: 'isSmallholderFarmer' as keyof ApplicationFormData,
    label: 'I am a smallholder farmer (farm size under 5 hectares)',
    description: 'Smallholder status qualifies you for dedicated smallholder support programmes under the APPEALS and VCDP schemes.',
    required: false,
    icon: 'HomeModernIcon',
  },
  {
    id: 'isYouthFarmer' as keyof ApplicationFormData,
    label: 'I am a youth farmer (aged 18–35 years)',
    description: 'Youth farmers receive priority consideration and higher grant allocations under FMARD APPEALS.',
    required: false,
    icon: 'AcademicCapIcon',
  },
  {
    id: 'isWomanFarmer' as keyof ApplicationFormData,
    label: 'I am a woman farmer / my farm is woman-led',
    description: 'Women-led farms receive dedicated support and quota allocations across all active grant programmes.',
    required: false,
    icon: 'HeartIcon',
  },
  {
    id: 'hasExistingLoanDefault' as keyof ApplicationFormData,
    label: 'I have an existing loan default recorded on the Credit Risk Management System (CRMS)',
    description: 'Applicants with existing defaults may still apply but will be subject to additional review. Non-disclosure is a disqualifying offence.',
    required: false,
    isWarning: true,
    icon: 'ExclamationTriangleIcon',
  },
];

export default function ComplianceChecklistFields({ register }: Props) {
  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
        <p className="text-xs text-blue-800 leading-relaxed">
          <Icon name="InformationCircleIcon" size={14} className="inline mr-1 text-blue-600" />
          <strong>Instructions:</strong> Tick each item that accurately applies to your situation. These declarations are used to determine your eligibility for specific grant programmes. All declarations are verified against government databases before disbursement.
        </p>
      </div>

      {checklistItems.map((item) => (
        <div
          key={`compliance-${item.id}`}
          className={`checkbox-item ${item.isWarning ? 'border-amber-300 bg-amber-50 hover:bg-amber-100' : ''}`}
        >
          <input
            id={item.id}
            type="checkbox"
            {...register(item.id)}
          />
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <Icon
                name={item.icon as Parameters<typeof Icon>[0]['name']}
                size={14}
                className={`mt-0.5 flex-shrink-0 ${item.isWarning ? 'text-amber-600' : 'text-primary'}`}
              />
              <div>
                <label
                  htmlFor={item.id}
                  className="text-sm font-semibold text-foreground cursor-pointer"
                >
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
          <strong>Data Protection Notice:</strong> Information provided in this compliance checklist will be cross-referenced with NIMC (NIN), CBN CRMS, CAC, and NIRSAL databases. Your data is protected under the Nigeria Data Protection Regulation (NDPR) 2019.
        </p>
      </div>
    </div>
  );
}