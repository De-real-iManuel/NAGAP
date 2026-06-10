import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SuccessContent from './components/SuccessContent';

export default function SuccessConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Page title bar */}
        <div className="bg-secondary text-white py-6 px-4 xl:px-10">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-2 text-green-300 text-xs mb-2">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span>/</span>
              <a href="/grant-application-form" className="hover:text-white transition-colors">Apply</a>
              <span>/</span>
              <span className="text-white font-semibold">Application Submitted</span>
            </div>
            <h1 className="text-white text-2xl font-extrabold">Application Submission Confirmed</h1>
            <p className="text-green-200 text-sm mt-1">
              Your grant application has been received by NAGAP.
            </p>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 xl:px-10 py-10">
          <SuccessContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}