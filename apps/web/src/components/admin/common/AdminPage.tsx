import React from 'react';

interface AdminPageProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const AdminPage = ({ title, description, actions, children }: AdminPageProps) => {
  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-400">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      
      <div className="bg-admin-bg rounded-lg shadow-sm border border-admin-card p-6">
        {children}
      </div>
    </div>
  );
};
