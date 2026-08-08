'use client';

import { Menu, LogOut, User } from 'lucide-react';
import { Button } from '@hirelinks/ui';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../../services/auth.service';
import { Breadcrumb } from './Breadcrumb';

interface HeaderProps {
  user: { email: string } | null;
  toggleSidebar: () => void;
}

export const Header = ({ user, toggleSidebar }: HeaderProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-admin-card bg-admin-bg px-4 shadow-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-400 hover:text-white hover:bg-admin-card">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:block">
          <Breadcrumb />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-accent/20 text-admin-accent">
            <User className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-medium text-gray-200 sm:block">
            {user?.email || 'Admin'}
          </span>
        </div>
        
        <div className="h-6 w-px bg-admin-card" />
        
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-red-500 hover:bg-admin-card transition-colors">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};
