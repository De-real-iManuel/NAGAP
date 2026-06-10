import React from 'react';
import Icon from '@/components/ui/AppIcon';

const stats = [
  { label: 'Applications Received', value: '48,231', icon: 'DocumentTextIcon', note: 'Since portal launch' },
  { label: 'Grants Disbursed', value: '₦142.8B', icon: 'BanknotesIcon', note: 'Total value disbursed' },
  { label: 'States Covered', value: '37', icon: 'MapIcon', note: 'All 36 states + FCT' },
  { label: 'Farmers Supported', value: '31,490', icon: 'UsersIcon', note: 'Verified beneficiaries' },
];

export default function StatsSection() {
  return (
    <section className="bg-primary py-8 px-4 xl:px-10">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={`stat-${stat.label}`}
            className="flex items-center gap-3 bg-white/10 rounded px-4 py-4 border border-white/20"
          >
            <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center flex-shrink-0">
              <Icon name={stat.icon as Parameters<typeof Icon>[0]['name']} size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-extrabold text-xl tabular-nums leading-tight">{stat.value}</p>
              <p className="text-green-200 text-xs font-medium">{stat.label}</p>
              <p className="text-green-300 text-xs opacity-80">{stat.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}