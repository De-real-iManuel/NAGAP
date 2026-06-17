'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { Application, ApplicationStatus, STATUS_CONFIG } from './types';
import { formatNaira, formatNigerianDate } from '@/lib/utils';

interface Props {
  application: Application;
  onClose: () => void;
  onStatusUpdate: (ref: string, status: ApplicationStatus, notes: string) => Promise<void>;
}

export default function ApplicationDetailModal({ application: app, onClose, onStatusUpdate }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(app.status);
  const [adminNotes, setAdminNotes] = useState(app.adminNotes ?? '');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    await onStatusUpdate(app.applicationReference, selectedStatus, adminNotes);
    setSaving(false);
  };

  const cfg = STATUS_CONFIG[app.status];

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-sm font-semibold text-foreground mt-0.5">{value ?? 'â€”'}</p>
    </div>
  );

  const Bool = ({ val }: { val?: boolean }) => (
    <span className={val ? 'Yes' : 'No'}>
      {val ? 'Yes' : 'No'}
    </span>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground font-mono">{app.applicationReference}</p>
            <h2 className="text-lg font-bold text-foreground">{app.farmerName}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={`status-badge ${cfg.className}`}>{cfg.label}</span>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-muted transition-colors">
              <Icon name="XMarkIcon" size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Personal Info */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
              <Icon name="UserIcon" size={12} /> Personal &amp; Contact
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Full Name" value={app.farmerName} />
              <Field label="Email" value={app.farmerEmail} />
              <Field label="Phone" value={app.farmerPhone} />
              <Field label="State" value={app.stateOfResidence} />
              <Field label="LGA" value={app.lga} />
              <Field label="Farm Location" value={app.farmLocation} />
            </div>
          </section>

          {/* Farm Profile */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
              <Icon name="HomeModernIcon" size={12} /> Farm Profile
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Farm Type" value={app.farmType} />
              <Field label="Farm Size" value={app.farmSizeHectares ? `${app.farmSizeHectares} ha` : 'â€”'} />
              <Field label="Years in Operation" value={app.yearsInOperation} />
              <Field label="Annual Revenue" value={app.annualRevenueNGN ? formatNaira(app.annualRevenueNGN) : 'â€”'} />
              <Field label="Crops / Livestock" value={app.cropOrLivestockTypes?.join(', ') || 'â€”'} />
            </div>
          </section>

          {/* Grant Request */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
              <Icon name="BanknotesIcon" size={12} /> Grant Request
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <Field label="Programme" value={app.grantProgram} />
              <Field label="Requested Amount" value={<span className="text-primary font-extrabold">{formatNaira(app.requestedFundingAmountNGN)}</span>} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">Project Description</p>
              <p className="text-sm text-foreground bg-muted rounded p-3 leading-relaxed">{app.proposedProjectDescription}</p>
            </div>
          </section>

          {/* Compliance */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
              <Icon name="ShieldCheckIcon" size={12} /> Compliance
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Has BVN', val: app.hasBVN },
                { label: 'CAC Registered', val: app.hasCACRegistration },
                { label: 'Cooperative Member', val: app.isMemberOfCooperative },
                { label: 'Land Document', val: app.hasLandDocument },
                { label: 'Smallholder', val: app.isSmallholderFarmer },
                { label: 'Youth Farmer', val: app.isYouthFarmer },
                { label: 'Woman Farmer', val: app.isWomanFarmer },
              ].map((item) => (
                <div key={item.label} className="bg-muted rounded p-2">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <Bool val={item.val} />
                </div>
              ))}
            </div>
          </section>

          {/* Documents */}
          {app.documents && Object.keys(app.documents).length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                <Icon name="PaperClipIcon" size={12} /> Documents
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(app.documents).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2 bg-muted rounded px-3 py-2">
                    <Icon
                      name={val ? 'CheckCircleIcon' : 'XCircleIcon'}
                      size={16}
                      className={val ? 'text-green-600' : 'text-red-500'}
                    />
                    <span className="text-xs text-foreground font-medium">
                      {key === 'ninDocument' && 'NIN Slip'}
                      {key === 'cacDocument' && 'CAC Certificate'}
                      {key === 'bankStatement' && 'Bank Statement'}
                      {key === 'landDocument' && 'Land Document'}
                      {!['ninDocument', 'cacDocument', 'bankStatement', 'landDocument'].includes(key) && key}
                    </span>
                    {val ? (
                      <span className="text-xs text-primary font-semibold truncate ml-auto select-all max-w-[150px]" title={val}>
                        {val}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic ml-auto">
                        Not Provided
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Timestamps */}
          <section className="grid grid-cols-2 gap-4">
            <Field label="Submitted At" value={formatNigerianDate(app.submittedAt)} />
            <Field label="Last Updated" value={formatNigerianDate(app.updatedAt)} />
          </section>

          {/* Admin Action */}
          <section className="bg-muted border border-border rounded p-4 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <Icon name="WrenchScrewdriverIcon" size={12} /> Admin Action
            </h3>
            <div>
              <label className="label-text mb-1 block">Update Status</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, typeof STATUS_CONFIG[ApplicationStatus]][]).map(([key, val]) => (
                  <label key={key} className={`flex items-center gap-2 cursor-pointer rounded border px-3 py-2 transition-colors ${selectedStatus === key ? 'border-primary bg-primary-light' : 'border-border bg-white'}`}>
                    <input type="radio" name="status" value={key} checked={selectedStatus === key} onChange={() => setSelectedStatus(key)} className="sr-only" />
                    <span className={`status-badge ${val.className} text-xs`}>{val.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="label-text mb-1 block">Admin Notes</label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes about this applicationâ€¦"
                className="input-field resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleUpdate} disabled={saving} className="btn-primary py-2 px-6 justify-center">
                {saving ? <><Icon name="ArrowPathIcon" size={14} className="animate-spin" /> Savingâ€¦</> : <><Icon name="CheckIcon" size={14} /> Save Changes</>}
              </button>
              <button onClick={onClose} className="btn-secondary py-2 px-5">Cancel</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

