import React from 'react';

interface FormSectionProps {
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function FormSection({ number, title, subtitle, children }: FormSectionProps) {
  return (
    <div>
      <div className="form-section-header flex items-center gap-3">
        <span className="bg-white/20 rounded px-2 py-0.5 text-xs font-black">{number}</span>
        <span dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      <div className="form-section-body">
        {subtitle && (
          <p className="text-xs text-muted-foreground mb-5 pb-4 border-b border-border leading-relaxed">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}