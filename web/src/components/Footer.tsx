import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const ministryLinks = [
  { label: 'Federal Ministry of Agriculture (FMARD)', href: '#' },
  { label: 'IFAD Nigeria', href: '#' },
  { label: 'USAID Feed the Future', href: '#' },
  { label: 'FAO Nigeria', href: '#' },
  { label: 'AGRA (Alliance for a Green Revolution in Africa)', href: '#' },
];

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Apply for Grant', href: '/grant-application-form' },
  { label: 'Check Application Status', href: '/status' },
  { label: 'Grant Programs', href: '#' },
  { label: 'Eligibility Criteria', href: '#' },
  { label: 'FAQs', href: '#' },
  { label: 'Contact Us', href: '#' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Use', href: '#' },
  { label: 'Accessibility', href: '#' },
  { label: 'Sitemap', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-white no-print">
      {/* Ministry logos bar */}
      <div className="border-b border-green-800 py-5">
        <div className="max-w-screen-2xl mx-auto px-4 xl:px-10">
          <p className="text-xs text-green-300 uppercase tracking-widest font-semibold mb-4 text-center">
            Implementing Partners &amp; Ministries
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['FMARD', 'IFAD', 'USAID', 'FAO', 'AGRA', 'CAC', 'NASS']?.map((org) => (
              <div
                key={`partner-${org}`}
                className="w-16 h-16 rounded bg-green-900 border border-green-700 flex items-center justify-center"
              >
                <span className="text-accent font-black text-xs text-center leading-tight">{org}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Main footer content */}
      <div className="py-10 px-4 xl:px-10">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <AppLogo size={36} />
              <span className="font-bold text-white text-sm">NAGAP Portal</span>
            </div>
            <p className="text-green-300 text-sm leading-relaxed mb-4">
              The Nigerian Agricultural Grant Application Portal (NAGAP) is the official digital gateway for farmers to access government agricultural support programmes.
            </p>
            <div className="flex gap-3">
              {['facebook', 'twitter', 'instagram', 'youtube']?.map((social) => (
                <a
                  key={`social-${social}`}
                  href="#"
                  className="w-8 h-8 rounded bg-green-800 hover:bg-primary flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <Icon name="GlobeAltIcon" size={14} className="text-green-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks?.map((link) => (
                <li key={`footer-quick-${link?.href}-${link?.label}`}>
                  <Link
                    href={link?.href}
                    className="text-green-300 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                  >
                    <Icon name="ChevronRightIcon" size={12} className="text-accent" />
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministry links */}
          <div>
            <h4 className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
              Partner Agencies
            </h4>
            <ul className="space-y-2">
              {ministryLinks?.map((link) => (
                <li key={`footer-ministry-${link?.label}`}>
                  <a
                    href={link?.href}
                    className="text-green-300 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                  >
                    <Icon name="BuildingLibraryIcon" size={12} className="text-accent" />
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
              Contact &amp; Support
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-green-300">
                <Icon name="MapPinIcon" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                <span>Area 11, Garki, Abuja, FCT, Nigeria</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-green-300">
                <Icon name="PhoneIcon" size={14} className="text-accent flex-shrink-0" />
                <span>+234-9-870-8900</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-green-300">
                <Icon name="EnvelopeIcon" size={14} className="text-accent flex-shrink-0" />
                <span>support@nagap.gov.ng</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-green-300">
                <Icon name="ClockIcon" size={14} className="text-accent flex-shrink-0" />
                <span>Mon–Fri: 8:00–17:00 WAT</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="border-t border-green-800 py-4 px-4 xl:px-10">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-green-400 text-xs text-center md:text-left">
            © 2026 Federal Ministry of Agriculture &amp; Rural Development, Federal Republic of Nigeria. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center md:justify-end">
            {legalLinks?.map((link) => (
              <a
                key={`footer-legal-${link?.label}`}
                href={link?.href}
                className="text-green-400 hover:text-white text-xs transition-colors"
              >
                {link?.label}
              </a>
            ))}
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto mt-3 flex items-center justify-center gap-2">
          <div className="gov-stripe w-24 rounded-full" style={{ height: '4px' }} />
          <span className="text-green-500 text-xs font-medium">Unity &bull; Faith &bull; Service</span>
          <div className="gov-stripe w-24 rounded-full" style={{ height: '4px' }} />
        </div>
      </div>
    </footer>
  );
}