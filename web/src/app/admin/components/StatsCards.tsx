'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { Application } from './types';
import { formatNaira } from '@/lib/utils';

interface Props {
  applications: Application[];
}

export default function StatsCards({ applications }: Props) {
  const total = applications.length;
  const approved = applications.filter((a) => a.status === 'approved').length;
  const underReview = applications.filter((a) => a.status === 'under_review').length;
  const docVerification = applications.filter((a) => a.status === 'document_verification').length;
  const rejected = applications.filter((a) => a.status === 'rejected').length;
  const totalRequested = applications.reduce((sum, a) => sum + a.requestedFundingAmountNGN, 0);
  const totalApproved = applications
    .filter((a) => a.status === 'approved')
    .reduce((sum, a) => sum + a.requestedFundingAmountNGN, 0);

  const cards = [
    { label: 'Total Applications', value: total.toLocaleString(), icon: 'DocumentTextIcon', color: 'text-primary', bg: 'bg-primary-light border-primary/20' },
    { label: 'Under Review', value: underReview.toLocaleString(), icon: 'ClockIcon', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { label: 'Doc Verification', value: docVerification.toLocaleString(), icon: 'DocumentMagnifyingGlassIcon', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { label: 'Approved', value: approved.toLocaleString(), icon: 'CheckCircleIcon', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
    { label: 'Rejected', value: rejected.toLocaleString(), icon: 'XCircleIcon', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
    { label: 'Total Requested', value: formatNaira(totalRequested), icon: 'BanknotesIcon', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
    { label: 'Total Approved Value', value: formatNaira(totalApproved), icon: 'CurrencyDollarIcon', color: 'text-primary', bg: 'bg-primary-light border-primary/20' },
    { label: 'Approval Rate', value: total ? `${Math.round((approved / total) * 100)}%` : '0%', icon: 'ChartBarIcon', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
      {cards.map((card) => (
        <div key={card.label} className={`border rounded p-3 flex flex-col gap-1 ${card.bg}`}>
          <div className="flex items-center gap-1.5">
            <Icon name={card.icon as Parameters<typeof Icon>[0]['name']} size={14} className={card.color} />
            <span className="text-xs text-muted-foreground font-medium leading-tight">{card.label}</span>
          </div>
          <p className={`text-lg font-extrabold tabular-nums leading-tight ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
