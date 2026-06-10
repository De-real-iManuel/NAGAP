import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusCheckClient from './components/StatusCheckClient';

export default function StatusPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="bg-secondary text-white py-6 px-4 xl:px-10">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-2 text-green-300 text-xs mb-2">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span>/</span>
              <span className="text-white font-semibold">Check Application Status</span>
            </div>
            <h1 className="text-white text-2xl font-extrabold">Check Application Status</h1>
            <p className="text-green-200 text-sm mt-1">
              Enter your reference number and registered email to view your application status.
            </p>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto px-4 xl:px-10 py-10">
          <StatusCheckClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}