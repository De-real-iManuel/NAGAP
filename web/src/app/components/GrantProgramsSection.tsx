import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const grantPrograms = [
  {
    id: 'grant-ifad-vcdp',
    acronym: 'IFAD VCDP',
    name: 'IFAD Value Chain Development Programme Grant',
    agency: 'International Fund for Agricultural Development (UN)',
    maxAmount: '₦5,000,000',
    targetBeneficiaries: 'Smallholder rice and cassava farmers',
    eligibility: ['Must reside in target project states', 'Must belong to an agricultural cooperative', 'Farm size: 0.5–5 hectares'],
    interestRate: 'Grant (Non-repayable)',
    tenor: 'Co-funded project',
    status: 'open',
    color: 'border-primary',
    icon: 'GlobeAltIcon',
  },
  {
    id: 'grant-fmard-appeals',
    acronym: 'APPEALS',
    name: 'FMARD APPEALS Grant',
    agency: 'Federal Ministry of Agriculture & Rural Development / World Bank',
    maxAmount: '₦6,000,000',
    targetBeneficiaries: 'Youth and women in agricultural value chains',
    eligibility: ['Aged 18–45 years', 'Priority for women-led farms', 'Must demonstrate agricultural value chain involvement'],
    interestRate: 'Grant (Non-repayable)',
    tenor: 'Immediate payout',
    status: 'open',
    color: 'border-blue-600',
    icon: 'SparklesIcon',
  },
  {
    id: 'grant-usaid-ftf',
    acronym: 'USAID FTF',
    name: 'USAID Feed the Future Grant',
    agency: 'United States Agency for International Development',
    maxAmount: '₦10,000,000',
    targetBeneficiaries: 'Smallholder cooperatives and agricultural SMEs',
    eligibility: ['Must register with CAC or Cooperative Council', 'Sustainable agricultural practices preferred', 'Mandatory BVN verification'],
    interestRate: 'Grant (Non-repayable)',
    tenor: 'Project based',
    status: 'open',
    color: 'border-green-600',
    icon: 'BuildingOfficeIcon',
  },
  {
    id: 'grant-gates-foundation',
    acronym: 'BMGF Grant',
    name: 'BMGF Smallholder Farmer Empowerment Grant',
    agency: 'Bill & Melinda Gates Foundation',
    maxAmount: '₦15,000,000',
    targetBeneficiaries: 'Rural smallholder farming families',
    eligibility: ['Women-led or youth-led farming business', 'Technological farming innovation focus', 'NIN identification required'],
    interestRate: 'Grant (Non-repayable)',
    tenor: 'Development program',
    status: 'open',
    color: 'border-amber-600',
    icon: 'HeartIcon',
  },
  {
    id: 'grant-agra-empowerment',
    acronym: 'AGRA Grant',
    name: 'AGRA Smallholder Farmer Grant',
    agency: 'Alliance for a Green Revolution in Africa',
    maxAmount: '₦8,000,000',
    targetBeneficiaries: 'Smallholder grain and legume farmers',
    eligibility: ['High-yield seed adoption plan', 'Active participation in cooperative society', 'Demonstrate climate-smart farming'],
    interestRate: 'Grant (Non-repayable)',
    tenor: 'Production based',
    status: 'open',
    color: 'border-purple-600',
    icon: 'MapPinIcon',
  },
  {
    id: 'grant-fao-smallholder',
    acronym: 'FAO Grant',
    name: 'FAO Smallholder Agricultural Grant',
    agency: 'Food and Agriculture Organization (UN)',
    maxAmount: '₦4,500,000',
    targetBeneficiaries: 'Subsistence crop and aquaculture farmers',
    eligibility: ['Eco-friendly farming practices', 'Must be smallholder family unit', 'Valid national identification slip (NIN)'],
    interestRate: 'Grant (Non-repayable)',
    tenor: 'Seasonal funding',
    status: 'open',
    color: 'border-teal-600',
    icon: 'AcademicCapIcon',
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
            <span className="text-primary text-sm font-bold">6 Programmes Open</span>
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