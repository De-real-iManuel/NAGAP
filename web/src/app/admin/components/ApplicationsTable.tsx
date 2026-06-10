'use client';

import React, { useMemo, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { Application, ApplicationStatus, STATUS_CONFIG } from './types';
import { formatNaira } from '@/lib/utils';
import { NIGERIAN_STATES, GRANT_PROGRAMS } from '@/lib/utils';

interface Props {
  applications: Application[];
  onSelect: (app: Application) => void;
  onStatusUpdate: (ref: string, status: ApplicationStatus, notes: string) => Promise<void>;
}

type SortKey = 'submittedAt' | 'farmerName' | 'requestedFundingAmountNGN' | 'stateOfResidence';
type SortDir = 'asc' | 'desc';

function exportCSV(data: Application[]) {
  const headers = [
    'Reference', 'Farmer Name', 'Email', 'Phone', 'State', 'LGA',
    'Grant Program', 'Requested Amount (NGN)', 'Farm Type', 'Status',
    'Submitted At', 'Updated At', 'Admin Notes',
  ];
  const rows = data.map((a) => [
    a.applicationReference, a.farmerName, a.farmerEmail, a.farmerPhone,
    a.stateOfResidence, a.lga, a.grantProgram, a.requestedFundingAmountNGN,
    a.farmType, a.status, a.submittedAt, a.updatedAt, a.adminNotes ?? '',
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nagap-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ApplicationsTable({ applications, onSelect, onStatusUpdate }: Props) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | ''>('');
  const [filterState, setFilterState] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('submittedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [quickAction, setQuickAction] = useState<{ ref: string; status: ApplicationStatus } | null>(null);
  const [quickSaving, setQuickSaving] = useState(false);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let data = [...applications];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((a) =>
        a.farmerName.toLowerCase().includes(q) ||
        a.applicationReference.toLowerCase().includes(q) ||
        a.farmerEmail.toLowerCase().includes(q)
      );
    }
    if (filterStatus) data = data.filter((a) => a.status === filterStatus);
    if (filterState) data = data.filter((a) => a.stateOfResidence === filterState);
    if (filterProgram) data = data.filter((a) => a.grantProgram === filterProgram);

    data.sort((a, b) => {
      const av = a[sortKey] as string | number;
      const bv = b[sortKey] as string | number;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [applications, search, filterStatus, filterState, filterProgram, sortKey, sortDir]);

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      <Icon name={sortDir === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={12} className="text-primary" />
    ) : (
      <Icon name="ChevronUpDownIcon" size={12} className="text-muted-foreground" />
    );

  const handleQuickSave = async () => {
    if (!quickAction) return;
    setQuickSaving(true);
    await onStatusUpdate(quickAction.ref, quickAction.status, '');
    setQuickSaving(false);
    setQuickAction(null);
  };

  return (
    <div className="bg-white border border-border rounded">
      {/* Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Icon name="MagnifyingGlassIcon" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, reference, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-8 text-sm"
          />
        </div>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | '')} className="input-field text-sm w-auto">
          <option value="">All Statuses</option>
          {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, typeof STATUS_CONFIG[ApplicationStatus]][]).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="input-field text-sm w-auto">
          <option value="">All States</option>
          {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={filterProgram} onChange={(e) => setFilterProgram(e.target.value)} className="input-field text-sm w-auto">
          <option value="">All Programs</option>
          {GRANT_PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <button onClick={() => exportCSV(filtered)} className="btn-secondary py-2 px-4 text-sm flex-shrink-0">
          <Icon name="ArrowDownTrayIcon" size={14} />
          Export CSV
        </button>
      </div>

      {/* Results count */}
      <div className="px-4 py-2 border-b border-border bg-muted flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{filtered.length} of {applications.length} applications</span>
        {(filterStatus || filterState || filterProgram || search) && (
          <button
            onClick={() => { setSearch(''); setFilterStatus(''); setFilterState(''); setFilterProgram(''); }}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <Icon name="XMarkIcon" size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-semibold">
                <button onClick={() => toggleSort('farmerName')} className="flex items-center gap-1">
                  Applicant <SortIcon k="farmerName" />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-semibold">Program</th>
              <th className="text-left px-4 py-3 font-semibold">
                <button onClick={() => toggleSort('stateOfResidence')} className="flex items-center gap-1">
                  State <SortIcon k="stateOfResidence" />
                </button>
              </th>
              <th className="text-right px-4 py-3 font-semibold">
                <button onClick={() => toggleSort('requestedFundingAmountNGN')} className="flex items-center gap-1 ml-auto">
                  Amount <SortIcon k="requestedFundingAmountNGN" />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-left px-4 py-3 font-semibold">
                <button onClick={() => toggleSort('submittedAt')} className="flex items-center gap-1">
                  Submitted <SortIcon k="submittedAt" />
                </button>
              </th>
              <th className="text-center px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                  <Icon name="InboxIcon" size={32} className="mx-auto mb-2 opacity-30" />
                  No applications match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((app) => {
                const cfg = STATUS_CONFIG[app.status];
                return (
                  <tr key={app.applicationReference} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{app.farmerName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{app.applicationReference}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-foreground leading-tight max-w-[160px] truncate" title={app.grantProgram}>
                        {app.grantProgram}
                      </p>
                      <p className="text-xs text-muted-foreground">{app.farmType}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{app.stateOfResidence}</td>
                    <td className="px-4 py-3 text-right font-bold text-primary tabular-nums">{formatNaira(app.requestedFundingAmountNGN)}</td>
                    <td className="px-4 py-3">
                      <span className={`status-badge ${cfg.className}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onSelect(app)}
                          className="p-1.5 rounded bg-primary-light text-primary hover:bg-primary hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Icon name="EyeIcon" size={14} />
                        </button>
                        {app.status === 'under_review' || app.status === 'document_verification' ? (
                          <>
                            <button
                              onClick={() => setQuickAction({ ref: app.applicationReference, status: 'approved' })}
                              className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                              title="Quick Approve"
                            >
                              <Icon name="CheckIcon" size={14} />
                            </button>
                            <button
                              onClick={() => setQuickAction({ ref: app.applicationReference, status: 'rejected' })}
                              className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                              title="Quick Reject"
                            >
                              <Icon name="XMarkIcon" size={14} />
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Quick action confirmation */}
      {quickAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Icon name={quickAction.status === 'approved' ? 'CheckCircleIcon' : 'XCircleIcon'} size={18} className={quickAction.status === 'approved' ? 'text-green-600' : 'text-red-600'} />
              {quickAction.status === 'approved' ? 'Approve' : 'Reject'} Application?
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              This will mark <span className="font-semibold text-foreground">{quickAction.ref}</span> as{' '}
              <span className={`font-bold ${quickAction.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                {quickAction.status}
              </span>. You can add detailed notes via View Details.
            </p>
            <div className="flex gap-3">
              <button onClick={handleQuickSave} disabled={quickSaving} className="btn-primary py-2 px-5 justify-center flex-1">
                {quickSaving ? <Icon name="ArrowPathIcon" size={14} className="animate-spin" /> : 'Confirm'}
              </button>
              <button onClick={() => setQuickAction(null)} className="btn-secondary py-2 px-5 flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
