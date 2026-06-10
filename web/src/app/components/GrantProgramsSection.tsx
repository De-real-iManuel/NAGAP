import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const grantPrograms = [
  {
    id: 'grant-cbn-abp',
    acronym: 'CBN ABP',
    name: 'CBN Anchor Borrowers Programme',
    agency: 'Central Bank of Nigeria',
    maxAmount: '₦5,000,000',
    targetBeneficiaries: 'Smallholder farmers growing staple crops',
    eligibility: ['Must cultivate rice, maize, wheat, or cotton', 'Must be a cooperative member', 'Farm size: 0.5–5 hectares'],
    interestRate: '9% per annum',
    tenor: '12 months',
    status: 'open',
    color: 'border-primary',
    icon: 'BuildingLibraryIcon',
  },
  {
    id: 'grant-nirsal-agsmeis',
    acronym: 'AGSMEIS',
    name: 'NIRSAL AGSMEIS',
    agency: 'NIRSAL Plc / CBN',
    maxAmount: '₦10,000,000',
    targetBeneficiaries: 'Agro-SMEs and agribusiness entrepreneurs',
    eligibility: ['Must have CAC registration', 'Business plan required', 'BVN verification mandatory'],
    interestRate: '5% per annum',
    tenor: '7 years',
    status: 'open',
    color: 'border-blue-600',
    icon: 'CurrencyDollarIcon',
  },
  {
    id: 'grant-boa-micro',
    acronym: 'BOA Micro',
    name: 'BOA Micro-Agriculture Loan',
    agency: 'Bank of Agriculture',
    maxAmount: '₦1,500,000',
    targetBeneficiaries: 'Subsistence and micro-farmers',
    eligibility: ['No formal collateral required', 'Group lending model accepted', 'NIN required'],
    interestRate: '12% per annum',
    tenor: '18 months',
    status: 'open',
    color: 'border-amber-600',
    icon: 'HomeIcon',
  },
  {
    id: 'grant-fmard-appeals',
    acronym: 'APPEALS',
    name: 'FMARD APPEALS',
    agency: 'Federal Ministry of Agriculture',
    maxAmount: '₦3,000,000',
    targetBeneficiaries: 'Youth and women in agro-value chains',
    eligibility: ['Must be 18–45 years old', 'Priority for women-led farms', 'Must be in target states'],
    interestRate: 'Grant (non-repayable)',
    tenor: 'N/A',
    status: 'open',
    color: 'border-green-600',
    icon: 'SparklesIcon',
  },
  {
    id: 'grant-ifad-vcdp',
    acronym: 'IFAD VCDP',
    name: 'IFAD Value Chain Development Programme',
    agency: 'IFAD / Federal Government',
    maxAmount: '₦2,500,000',
    targetBeneficiaries: 'Farmers in rice and cassava value chains',
    eligibility: ['Must be in Anambra, Cross River, Kogi, Niger, Ogun, or Taraba', 'Cooperative membership preferred', 'BVN required'],
    interestRate: 'Subsidised 5%',
    tenor: '5 years',
    status: 'open',
    color: 'border-purple-600',
    icon: 'GlobeAltIcon',
  },
];

export default function GrantProgramsSection() {
  return (
    <section className="py-14 px-4 xl:px-10 bg-background">
      <div className="max-w-screen-2xl mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                2026 Grant Window
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-foreground">
              Currently Open Grant Programmes
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Select a programme below to view eligibility criteria and apply online.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-primary-light border border-primary/20 rounded px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-sm font-bold">5 Programmes Open</span>
          </div>
        </div>

        {/* Grant cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
          {grantPrograms.map((grant) => (
            <div key={grant.id} className={`grant-card border-t-4 ${grant.color} flex flex-col`}>
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded bg-primary-light flex items-center justify-center">
                    <Icon name={grant.icon as Parameters<typeof Icon>[0]['name']} size={18} className="text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-primary uppercase tracking-wider">{grant.acronym}</span>
                    <p className="text-xs text-muted-foreground">{grant.agency}</p>
                  </div>
                </div>
                <span className="status-badge status-approved text-xs flex-shrink-0">Open</span>
              </div>

              {/* Grant name */}
              <h3 className="text-foreground font-bold text-sm mb-3 leading-snug">{grant.name}</h3>

              {/* Amount + terms */}
              <div className="grid grid-cols-3 gap-2 mb-3 bg-muted rounded p-2">
                <div className="text-center">
                  <p className="text-foreground font-extrabold text-sm tabular-nums">{grant.maxAmount}</p>
                  <p className="text-muted-foreground text-xs">Max Amount</p>
                </div>
                <div className="text-center border-x border-border">
                  <p className="text-foreground font-bold text-sm">{grant.interestRate}</p>
                  <p className="text-muted-foreground text-xs">Interest</p>
                </div>
                <div className="text-center">
                  <p className="text-foreground font-bold text-sm">{grant.tenor}</p>
                  <p className="text-muted-foreground text-xs">Tenor</p>
                </div>
              </div>

              {/* Target beneficiaries */}
              <p className="text-muted-foreground text-xs mb-3 italic leading-relaxed">
                <strong className="text-foreground not-italic">For:</strong> {grant.targetBeneficiaries}
              </p>

              {/* Eligibility bullets */}
              <ul className="space-y-1 mb-4 flex-1">
                {grant.eligibility.map((item, idx) => (
                  <li key={`${grant.id}-elig-${idx}`} className="flex items-start gap-1.5 text-xs text-foreground">
                    <Icon name="CheckCircleIcon" size={12} className="text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/grant-application-form"
                className="btn-primary justify-center text-xs py-2.5 mt-auto"
              >
                <Icon name="DocumentPlusIcon" size={14} />
                Apply for This Programme
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}