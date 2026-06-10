import React from 'react';
import Icon from '@/components/ui/AppIcon';

const notices = [
  {
    id: 'notice-001',
    type: 'important',
    date: '09 Jun 2026',
    title: '2026 Grant Application Window Now Open',
    body: 'The Federal Ministry of Agriculture & Rural Development announces the opening of the 2026 agricultural grant window. All eligible farmers are encouraged to apply before 31st August 2026.',
  },
  {
    id: 'notice-002',
    type: 'info',
    date: '02 Jun 2026',
    title: 'BVN Verification Now Mandatory for All Applications',
    body: 'Effective immediately, all applicants must provide a valid Bank Verification Number (BVN). Applications without BVN will be automatically rejected at the document verification stage.',
  },
  {
    id: 'notice-003',
    type: 'warning',
    date: '28 May 2026',
    title: 'Beware of Fraudulent Agents Charging Application Fees',
    body: 'NAGAP does not charge any fees for grant applications. Report any individual or agent demanding payment to the EFCC or ICPC immediately. Application is 100% free.',
  },
  {
    id: 'notice-004',
    type: 'info',
    date: '15 May 2026',
    title: 'IFAD VCDP Extends Target States to Include Benue and Kano',
    body: 'Following approval by the IFAD Country Office, farmers in Benue and Kano states are now eligible to apply for the IFAD Value Chain Development Programme for the 2026 cycle.',
  },
  {
    id: 'notice-005',
    type: 'success',
    date: '01 May 2026',
    title: '2025 Beneficiaries: Second Disbursement Completed',
    body: '₦18.4 billion has been successfully disbursed to 12,847 approved beneficiaries from the 2025 grant cycle. SMS notifications have been sent to all beneficiaries.',
  },
];

const noticeTypeConfig: Record<string, { icon: string; className: string; label: string }> = {
  important: { icon: 'MegaphoneIcon', className: 'border-l-4 border-red-500 bg-red-50', label: 'Important' },
  info: { icon: 'InformationCircleIcon', className: 'border-l-4 border-blue-500 bg-blue-50', label: 'Information' },
  warning: { icon: 'ExclamationTriangleIcon', className: 'border-l-4 border-amber-500 bg-amber-50', label: 'Warning' },
  success: { icon: 'CheckCircleIcon', className: 'border-l-4 border-green-500 bg-green-50', label: 'Update' },
};

export default function NoticeBoardSection() {
  return (
    <section className="py-14 px-4 xl:px-10 bg-muted">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notice board */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-xl font-extrabold text-foreground">Official Notice Board</h2>
              <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded tabular-nums">
                {notices.length} Notices
              </span>
            </div>

            <div className="space-y-3">
              {notices.map((notice) => {
                const config = noticeTypeConfig[notice.type];
                return (
                  <div
                    key={notice.id}
                    className={`rounded px-4 py-3 ${config.className}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        name={config.icon as Parameters<typeof Icon>[0]['name']}
                        size={16}
                        className="mt-0.5 flex-shrink-0 text-foreground"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-bold text-muted-foreground">{notice.date}</span>
                          <span className="text-xs font-bold text-foreground">{notice.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{notice.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick application guide */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-accent rounded-full" />
              <h2 className="text-xl font-extrabold text-foreground">How to Apply</h2>
            </div>

            <div className="space-y-3">
              {[
                { step: '01', title: 'Gather Required Documents', desc: 'NIN slip, BVN, CAC certificate (if applicable), bank statement, land document.' },
                { step: '02', title: 'Complete Online Form', desc: 'Fill all sections of the application form accurately. Ensure farm details are correct.' },
                { step: '03', title: 'Upload Documents', desc: 'Upload scanned copies of all required documents in PDF or image format.' },
                { step: '04', title: 'Submit & Get Reference', desc: 'Submit your application and note your NAGAP reference number for tracking.' },
                { step: '05', title: 'Await Review', desc: 'Applications are reviewed within 10–15 working days. You will be contacted via SMS and email.' },
              ].map((item) => (
                <div
                  key={`step-${item.step}`}
                  className="flex items-start gap-3 bg-white border border-border rounded p-3"
                >
                  <div className="w-7 h-7 rounded bg-primary text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-amber-50 border border-amber-200 rounded p-3">
              <div className="flex items-start gap-2">
                <Icon name="ExclamationTriangleIcon" size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Helpline:</strong> Call 0800-NAGAP-NG (0800-624-27-64) for free assistance. Available Mon–Fri, 8am–5pm WAT.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}