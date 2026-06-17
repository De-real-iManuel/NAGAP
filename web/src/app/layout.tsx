import React from 'react';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';

const plusJakartaSans = localFont({
  src: [
    {
      path: '../../public/fonts/PlusJakartaSans-VariableFont_wght.ttf',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'NAGAP — Nigerian Agricultural Grant Application Portal',
  description:
    'Apply for international agricultural grants online through the official Nigerian Agricultural Grant Application Portal. IFAD VCDP, FMARD APPEALS, USAID, FAO and AGRA programmes for smallholder farmers in Nigeria.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        {children}
        <Toaster position="bottom-right" richColors />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fnagap9035back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.19" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}