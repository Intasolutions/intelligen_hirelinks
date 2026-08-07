'use client';

import { useState } from 'react';
import { Sidebar } from '../../components/admin/layout/Sidebar';
import { Header } from '../../components/admin/layout/Header';

export default function AdminLayout({
  children,
  user
}: {
  children: React.ReactNode;
  user: { email: string } | null;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          user={user} 
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
