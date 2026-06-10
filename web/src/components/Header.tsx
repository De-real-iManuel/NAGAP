'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/grant-application-form', label: 'Apply Now' },
  { href: '/status', label: 'Check Status' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="no-print">
      {/* Nigerian flag stripe */}
      <div className="gov-stripe" />
      {/* Top government identity bar */}
      <div className="gov-header-bg text-white py-3 px-4">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-4">
          {/* Coat of Arms placeholder */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center border-2 border-accent/60">
            <span className="text-secondary font-black text-lg leading-none select-none">&#x1F985;</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">
              Federal Republic of Nigeria
            </span>
            <span className="text-white font-bold text-sm sm:text-base leading-tight">
              Federal Ministry of Agriculture &amp; Rural Development
            </span>
            <span className="text-green-200 text-xs mt-0.5 hidden sm:block">
              Nigerian Agricultural Grant Application Portal (NAGAP)
            </span>
          </div>
          <div className="ml-auto hidden lg:flex items-center gap-6 text-xs text-green-200">
            <span className="flex items-center gap-1">
              <Icon name="PhoneIcon" size={12} className="text-accent" />
              +234-9-870-8900
            </span>
            <span className="flex items-center gap-1">
              <Icon name="EnvelopeIcon" size={12} className="text-accent" />
              support@nagap.gov.ng
            </span>
            <span className="flex items-center gap-1">
              <Icon name="ClockIcon" size={12} className="text-accent" />
              Mon–Fri: 8:00–17:00 WAT
            </span>
          </div>
        </div>
      </div>
      {/* Navigation bar */}
      <nav className="bg-white border-b-2 border-primary shadow-sm sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo + Portal name */}
          <div className="flex items-center gap-2">
            <AppLogo size={32} />
            <span className="font-bold text-primary text-sm hidden sm:block tracking-tight">
              NAGAP Portal
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks?.map((link) => {
              const isActive = pathname === link?.href;
              return (
                <Link
                  key={`nav-${link?.href}`}
                  href={link?.href}
                  className={[
                    'px-4 py-2 text-sm font-600 rounded transition-colors duration-150',
                    isActive
                      ? 'bg-primary text-white font-bold' :'text-foreground hover:bg-primary-light hover:text-primary font-semibold',
                  ]?.join(' ')}
                >
                  {link?.label}
                </Link>
              );
            })}
            <Link
              href="/grant-application-form"
              className="ml-3 btn-primary text-xs py-2 px-4"
            >
              <Icon name="DocumentPlusIcon" size={14} />
              Apply Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Icon name={mobileOpen ? 'XMarkIcon' : 'Bars3Icon'} size={22} />
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
            {navLinks?.map((link) => {
              const isActive = pathname === link?.href;
              return (
                <Link
                  key={`mobile-nav-${link?.href}`}
                  href={link?.href}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    'px-4 py-2.5 text-sm font-semibold rounded transition-colors',
                    isActive
                      ? 'bg-primary text-white' :'text-foreground hover:bg-primary-light hover:text-primary',
                  ]?.join(' ')}
                >
                  {link?.label}
                </Link>
              );
            })}
            <Link
              href="/grant-application-form"
              onClick={() => setMobileOpen(false)}
              className="mt-2 btn-primary justify-center"
            >
              <Icon name="DocumentPlusIcon" size={14} />
              Apply Now
            </Link>
          </div>
        )}
      </nav>
      {/* Notice ticker */}
      <div className="bg-secondary text-white py-1.5 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-3 px-4">
          <span className="flex-shrink-0 bg-accent text-secondary text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider">
            Notice
          </span>
          <div className="overflow-hidden flex-1">
            <p className="notice-ticker text-xs whitespace-nowrap text-green-100">
              2026 Grant Window is OPEN — CBN Anchor Borrowers Programme, NIRSAL AGSMEIS, BOA Micro-Agriculture Loan, FMARD APPEALS, and IFAD VCDP are now accepting applications. Deadline: 31st August 2026. Apply before the window closes.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}