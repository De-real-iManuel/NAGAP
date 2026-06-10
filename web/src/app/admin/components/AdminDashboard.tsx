'use client';

import React, { useState, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import StatsCards from './StatsCards';
import ApplicationsTable from './ApplicationsTable';
import ApplicationDetailModal from './ApplicationDetailModal';
import { Application, ApplicationStatus, MOCK_APPLICATIONS } from './types';

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [selected, setSelected] = useState<Application | null>(null);

  const handleStatusUpdate = useCallback(async (ref: string, status: ApplicationStatus, notes: string) => {
    // Optimistic update
    setApplications((prev) =>
      prev.map((a) =>
        a.applicationReference === ref
          ? { ...a, status, adminNotes: notes || a.adminNotes, updatedAt: new Date().toISOString() }
          : a
      )
    );
    // Also update modal's view if it's open
    setSelected((prev) =>
      prev?.applicationReference === ref
        ? { ...prev, status, adminNotes: notes || prev.adminNotes, updatedAt: new Date().toISOString() }
        : prev
    );
    // Fire API (best-effort; in-memory store won't persist across requests but works in same process)
    try {
      await fetch(`/api/v1/application/${ref}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes }),
      });
    } catch {
      // silently fail â€” optimistic update already applied
    }
  }, []);

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Admin Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Applications Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage, review and process NAGAP grant applications</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          <Icon name="ExclamationTriangleIcon" size={14} className="text-amber-600" />
          <span className="text-xs text-amber-800 font-medium">Admin access only â€” handle data with care</span>
        </div>
      </div>

      <StatsCards applications={applications} />

      <ApplicationsTable
        applications={applications}
        onSelect={setSelected}
        onStatusUpdate={handleStatusUpdate}
      />

      {selected && (
        <ApplicationDetailModal
          application={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

