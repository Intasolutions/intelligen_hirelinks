import { LayoutDashboard, FileText, Image as ImageIcon, Settings, Users, Briefcase, Inbox } from 'lucide-react';

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
        label: 'Enquiries',
        href: '/admin/enquiries',
        icon: Inbox,
        disabled: false,
      },
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
      }
    ]
  },
  {
    title: 'SETTINGS',
    items: [
      {
        label: 'General Settings',
        href: '/admin/settings',
        icon: Settings,
        disabled: false,
      }
    ]
  }
];
