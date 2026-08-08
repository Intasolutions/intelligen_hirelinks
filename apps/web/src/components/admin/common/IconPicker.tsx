import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, ChevronDown } from 'lucide-react';

const COMMON_ICONS = [
  'Globe', 'Monitor', 'Briefcase', 'Users', 'Star', 'Check', 'Search', 
  'Mail', 'Phone', 'Camera', 'Book', 'FileText', 'Inbox', 'LayoutDashboard', 
  'Settings', 'GraduationCap', 'Building', 'MapPin', 'ArrowRight', 'Award',
  'CheckCircle', 'Clock', 'CreditCard', 'File', 'Folder', 'Heart', 'Home',
  'Image', 'Info', 'Link', 'List', 'Lock', 'MessageCircle', 'MessageSquare',
  'Paperclip', 'Play', 'Plus', 'Send', 'Share', 'Shield', 'ShoppingCart',
  'Tag', 'Trash', 'TrendingUp', 'User', 'Video', 'Zap', 'Activity', 'Anchor',
  'Aperture', 'Archive', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'AtSign'
];

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className = '' }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const filteredIcons = COMMON_ICONS.filter(icon => icon.toLowerCase().includes(search.toLowerCase()));
  
  // Use 'Globe' or the current value. Ensure first letter is capitalized.
  const safeValue = value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
  const SelectedIcon = (LucideIcons as any)[safeValue] || LucideIcons.Circle;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-10 px-3 py-2 text-sm text-left text-white bg-admin-bg border border-admin-card rounded-md focus:outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
      >
        <span className="flex items-center gap-2 truncate">
          {safeValue ? (
            <>
              <SelectedIcon className="w-4 h-4 text-admin-accent" />
              <span className="truncate">{safeValue}</span>
            </>
          ) : (
            <span className="text-gray-400">Select Icon...</span>
          )}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 mt-1 bg-[#18232c] border border-admin-card rounded-md shadow-lg">
          <div className="p-2 border-b border-admin-card">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-8 pr-3 text-sm text-white bg-[#1D1D1D] border border-admin-card rounded-md focus:outline-none focus:border-admin-accent"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-60 p-1">
            {filteredIcons.length === 0 ? (
              <div className="p-3 text-sm text-center text-gray-400">No icons found.</div>
            ) : (
              <div className="grid grid-cols-2 gap-1 p-1">
                {filteredIcons.map((iconName) => {
                  const Icon = (LucideIcons as any)[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => {
                        onChange(iconName);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-[#2A9D8F] hover:text-white transition-colors ${
                        safeValue === iconName ? 'bg-[#2A9D8F]/20 text-[#2A9D8F]' : 'text-gray-300'
                      }`}
                    >
                      {Icon && <Icon className="w-5 h-5 mb-1" />}
                      <span className="text-[10px] truncate max-w-full">{iconName}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
