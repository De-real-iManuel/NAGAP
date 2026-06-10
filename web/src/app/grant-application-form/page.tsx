import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import ApplicationFormClient from './components/ApplicationFormClient';

export default function GrantApplicationFormPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="bg-secondary text-white py-6 px-4 xl:px-10">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-2 text-green-300 text-xs mb-2">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span>/</span>
              <span className="text-white font-semibold">Grant Application</span>
            </div>
            <h1 className="text-white text-2xl font-extrabold">
              Agricultural Grant Application Form
            </h1>
            <p className="text-green-200 text-sm mt-1">
              Complete all sections carefully. Fields marked <span className="text-red-300 font-bold">*</span> are required.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border-b border-amber-200 px-4 xl:px-10 py-3">
          <div className="max-w-screen-2xl mx-auto flex items-start gap-2">
            <Icon name="ExclamationTriangleIcon" size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-amber-800 text-xs leading-relaxed">
              <strong>Important:</strong> Ensure all information provided is accurate and matches your official documents. Submission of false information may result in immediate disqualification and potential legal action under the False Claims Act, Cap F3, LFN 2004. This portal does not charge any fees — report any agent demanding payment to EFCC: 0800-CALL-EFCC.
            </p>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 xl:px-10 py-8">
          <ApplicationFormClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
