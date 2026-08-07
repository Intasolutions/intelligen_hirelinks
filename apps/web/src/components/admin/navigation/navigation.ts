import { LayoutDashboard, FileText, Image as ImageIcon, Settings, Users, Briefcase } from 'lucide-react';

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export interface NavigationItem {
  label: string;
  href: string;
  icon: any; // Lucide icon
  disabled?: boolean;
}

export const adminNavigation: NavigationSection[] = [
  {
    title: 'GENERAL',
    items: [
      {
        label: 'Admin Home',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
      },
    ]
  },
  {
    title: 'CONTENT',
    items: [
      {
        label: 'Reviews',
        href: '/admin/reviews',
        icon: FileText,
        disabled: false,
      },
      {
        label: 'Programs',
        href: '/admin/programs',
        icon: Briefcase,
        disabled: false,
      },
      {
        label: 'Services',
        href: '/admin/services',
        icon: Briefcase,
        disabled: false,
      },
      {
        label: 'Blogs',
        href: '/admin/blogs',
        icon: FileText,
        disabled: false,
      },
      {
        label: 'Pages',
        href: '/admin/pages',
        icon: FileText,
        disabled: false,
      },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      {
        label: 'Media',
        href: '/admin/media',
        icon: ImageIcon,
        disabled: true,
      },
      {
        label: 'Settings',
        href: '/admin/settings',
        icon: Settings,
        disabled: false,
      },
    ]
  },
  {
    title: 'ACCESS',
    items: [
      {
        label: 'Administrators',
        href: '/admin/users',
        icon: Users,
        disabled: true,
      },
    ]
  }
];
