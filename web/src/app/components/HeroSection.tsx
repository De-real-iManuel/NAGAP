import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function HeroSection() {
  return (
    <section className="relative bg-secondary overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)',
          }}
        />
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-4 xl:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: text content */}
          <div>
            {/* Official badge */}
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded px-3 py-1.5 mb-6">
              <span className="text-accent text-xs font-bold uppercase tracking-wider">
                🏛️ Official Government Portal
              </span>
            </div>

            <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Apply for{' '}
              <span className="text-accent">Agricultural Grants</span>{' '}
              Online
            </h1>

            <p className="text-green-200 text-base sm:text-lg leading-relaxed mb-3">
              The Nigerian Agricultural Grant Application Portal (NAGAP) provides farmers, cooperatives, and agribusinesses with direct access to government-backed agricultural financing programmes.
            </p>

            <p className="text-green-300 text-sm mb-8">
              <Icon name="ExclamationCircleIcon" size={14} className="inline mr-1 text-accent" />
              2026 Grant Window is currently <strong className="text-white">OPEN</strong>. Deadline: 31st August 2026.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/grant-application-form" className="btn-primary text-base px-8 py-3 justify-center">
                <Icon name="DocumentPlusIcon" size={18} />
                Start Application
              </Link>
              <Link href="/status" className="btn-secondary text-base px-6 py-3 border-white/30 text-white hover:bg-white/10 justify-center">
                <Icon name="MagnifyingGlassIcon" size={18} />
                Check Status
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { icon: 'ShieldCheckIcon', text: 'Secure & Official' },
                { icon: 'ClockIcon', text: '10–15 Working Days' },
                { icon: 'DocumentCheckIcon', text: 'Free to Apply' },
              ].map((item) => (
                <div key={`trust-${item.text}`} className="flex items-center gap-2 text-green-300 text-sm">
                  <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={16} className="text-accent" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile grant summary */}
          <div className="lg:hidden bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 text-sm font-semibold">5 Grant Windows Open — 2026</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['IFAD VCDP', 'FMARD APPEALS', 'USAID FtF', 'AGRA Grant', 'FAO Grant'].map((name) => (
                <div key={name} className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-white text-xs font-medium">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: info card (desktop) */}
          <div className="hidden lg:block">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 text-sm font-semibold">Live Grant Windows — 2026</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'IFAD VCDP Grant', max: '₦5,000,000', deadline: '31 Aug 2026', open: true },
                  { name: 'FMARD APPEALS Grant', max: '₦6,000,000', deadline: '31 Aug 2026', open: true },
                  { name: 'USAID Feed the Future Grant', max: '₦10,000,000', deadline: '31 Aug 2026', open: true },
                  { name: 'AGRA Smallholder Grant', max: '₦8,000,000', deadline: '31 Aug 2026', open: true },
                  { name: 'FAO Smallholder Grant', max: '₦4,500,000', deadline: '31 Aug 2026', open: true },
                ].map((grant) => (
                  <div
                    key={`hero-grant-${grant.name}`}
                    className="flex items-center justify-between bg-white/5 rounded px-3 py-2.5 border border-white/10"
                  >
                    <div>
                      <p className="text-white text-sm font-semibold leading-tight">{grant.name}</p>
                      <p className="text-green-300 text-xs mt-0.5">Max: {grant.max} · Due: {grant.deadline}</p>
                    </div>
                    <span className="status-badge status-approved text-xs ml-3 flex-shrink-0">
                      Open
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/grant-application-form"
                className="mt-4 w-full btn-primary justify-center text-sm py-3"
              >
                <Icon name="ArrowRightIcon" size={16} />
                Apply for Any Programme
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}