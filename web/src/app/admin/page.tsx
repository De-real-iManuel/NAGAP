import React from 'react';
import Header from '@/components/Header';
import AdminDashboard from './components/AdminDashboard';

export const metadata = { title: 'Admin — NAGAP Portal' };

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 xl:px-10 py-8">
        <AdminDashboard />
      </main>
    </div>
  );
}
