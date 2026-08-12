'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavigation } from '../navigation/navigation';
import { cn } from '@hirelinks/ui';

interface SidebarProps {
  isCollapsed?: boolean;
}

export const Sidebar = ({ isCollapsed = false }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "flex flex-col border-r border-admin-card bg-admin-bg transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
        {isCollapsed ? (
          <span className="text-xl font-bold text-admin-accent">HL</span>
        ) : (
          <span className="text-xl font-extrabold text-white tracking-tight">Hirelinks<span className="text-admin-accent text-sm ml-1 font-medium">CMS</span></span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {adminNavigation.map((section, index) => (
          <div key={index} className="mb-6 px-3">
            {!isCollapsed && (
              <h4 className="mb-2 px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                {section.title}
              </h4>
            )}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                return item.disabled ? (
                  <div key={item.label} className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-500 cursor-not-allowed",
                    isCollapsed && "justify-center px-0"
                  )}>
                    <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                    {!isCollapsed && item.label}
                  </div>
                ) : (
                  <Link key={item.label} href={item.href} className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-admin-accent text-white shadow-sm" : "text-gray-400 hover:bg-admin-card hover:text-gray-200",
                    isCollapsed && "justify-center px-0"
                  )}>
                    <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                    {!isCollapsed && item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
};
