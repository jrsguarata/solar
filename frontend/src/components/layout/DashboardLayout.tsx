import { ReactNode } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
