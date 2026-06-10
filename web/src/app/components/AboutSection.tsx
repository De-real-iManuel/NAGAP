import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function AboutSection() {
  return (
    <section className="py-14 px-4 xl:px-10 bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: about text */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                About NAGAP
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-foreground mb-4">
              Nigeria&apos;s Official Gateway to Agricultural Financing
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              The Nigerian Agricultural Grant Application Portal (NAGAP) was established by the Federal Ministry of Agriculture and Rural Development to digitalise and streamline access to agricultural financing for Nigerian farmers, cooperatives, and agribusinesses.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Through NAGAP, eligible applicants can apply for grants and soft loans from multiple government programmes — including CBN, NIRSAL, BOA, FMARD, and IFAD — through a single unified platform, eliminating the need to visit multiple offices.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: 'ShieldCheckIcon', label: 'Secure & Encrypted' },
                { icon: 'DevicePhoneMobileIcon', label: 'Mobile Friendly' },
                { icon: 'ClockIcon', label: '24/7 Availability' },
                { icon: 'DocumentCheckIcon', label: 'Free to Apply' },
              ].map((feat) => (
                <div key={`feat-${feat.label}`} className="flex items-center gap-2 bg-primary-light rounded p-2.5">
                  <Icon name={feat.icon as Parameters<typeof Icon>[0]['name']} size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm font-semibold text-foreground">{feat.label}</span>
                </div>
              ))}
            </div>

            <Link href="/grant-application-form" className="btn-primary">
              <Icon name="DocumentPlusIcon" size={16} />
              Apply for a Grant Now
            </Link>
          </div>

          {/* Right: mandate card */}
          <div className="bg-muted rounded-lg p-6 border border-border">
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Icon name="ScaleIcon" size={18} className="text-primary" />
              Our Mandate
            </h3>
            <ul className="space-y-3">
              {[
                'Facilitate access to agricultural financing for all eligible Nigerian farmers',
                'Reduce bureaucratic barriers in grant application and approval processes',
                'Ensure transparency and accountability in the disbursement of agricultural funds',
                'Promote food security, rural development, and agricultural modernisation',
                'Support youth and women in agriculture through targeted grant programmes',
                'Maintain a credible database of smallholder farmers across all 36 states and FCT',
              ].map((item, idx) => (
                <li key={`mandate-${idx}`} className="flex items-start gap-2 text-sm text-foreground">
                  <Icon name="CheckCircleIcon" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                NAGAP operates under the authority of the Federal Ministry of Agriculture and Rural Development (FMARD) in collaboration with the Central Bank of Nigeria (CBN), NIRSAL Plc, Bank of Agriculture (BOA), and international development partners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}