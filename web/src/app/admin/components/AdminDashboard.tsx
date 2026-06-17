'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import StatsCards from './StatsCards';
import ApplicationsTable from './ApplicationsTable';
import ApplicationDetailModal from './ApplicationDetailModal';
import { Application, ApplicationStatus } from './types';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);

  // Check login status on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/v1/admin/status');
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
        if (data.authenticated) {
          fetchApplications();
        }
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  const fetchApplications = async () => {
    setIsLoadingApps(true);
    try {
      const res = await fetch('/api/v1/application');
      const data = await res.json();
      if (res.ok && data.applications) {
        setApplications(data.applications);
      } else {
        toast.error('Failed to load real database applications.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not connect to application server.');
    } finally {
      setIsLoadingApps(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/v1/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        toast.success('Successfully authenticated.');
        fetchApplications();
      } else {
        toast.error(data.error || 'Invalid credentials.');
      }
    } catch {
      toast.error('An error occurred during authentication.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/v1/admin/logout', { method: 'POST' });
      if (res.ok) {
        setIsAuthenticated(false);
        setApplications([]);
        toast.success('Logged out successfully.');
      }
    } catch {
      toast.error('Logout failed.');
    }
  };

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

    try {
      const res = await fetch(`/api/v1/application/${ref}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes }),
      });
      if (res.ok) {
        toast.success(`Application ${ref} updated successfully.`);
      } else {
        toast.error('Failed to update status on server.');
        fetchApplications(); // refresh to sync
      }
    } catch {
      toast.error('Network error updating application.');
      fetchApplications();
    }
  }, []);

  // Loading Session State
  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground text-sm font-semibold">Securing Connection...</p>
      </div>
    );
  }

  // Login Form Screen
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-md bg-white border border-border rounded-xl shadow-xl overflow-hidden">
          <div className="bg-primary text-white px-6 py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-3">
              <Icon name="LockClosedIcon" size={28} className="text-white" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">NAGAP Admin Portal</h2>
            <p className="text-green-100 text-xs mt-1">Authorized Personnel Access Only</p>
          </div>
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Admin Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full input-field"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoggingIn}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full input-field"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn}
              />
            </div>
            <button
              type="submit"
              className="w-full btn-primary justify-center text-sm py-2.5 mt-2"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Icon name="KeyIcon" size={16} />
                  Login to Dashboard
                </>
              )}
            </button>
          </form>
          <div className="px-6 py-4 bg-muted border-t border-border text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Icon name="ShieldCheckIcon" size={14} className="text-primary" />
              NAGAP Secure Administration Session
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Main View
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
        <div className="flex items-center gap-3">
          <button
            onClick={fetchApplications}
            className="btn-secondary py-1.5 px-3 text-xs"
            title="Refresh database records"
          >
            <Icon name="ArrowPathIcon" size={14} className={isLoadingApps ? 'animate-spin' : ''} />
            Sync DB
          </button>
          <button
            onClick={handleLogout}
            className="btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 py-1.5 px-3 text-xs"
          >
            <Icon name="ArrowRightOnRectangleIcon" size={14} />
            Logout
          </button>
        </div>
      </div>

      <StatsCards applications={applications} />

      {isLoadingApps ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] bg-white border border-border rounded-lg shadow-sm mt-6 p-10">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">Loading applications database...</p>
        </div>
      ) : (
        <ApplicationsTable
          applications={applications}
          onSelect={setSelected}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

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


