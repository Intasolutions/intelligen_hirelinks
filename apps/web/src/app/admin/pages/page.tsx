'use client';

import { AdminPage } from '../../../components/admin/common/AdminPage';
import { Edit2, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PagesList() {
  const pages = [
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      description: 'Manage how user data is collected and used.'
    },
    {
      title: 'Terms & Conditions',
      slug: 'terms-conditions',
      description: 'Manage platform rules, liabilities, and agreements.'
    }
  ];

  return (
    <AdminPage 
      title="Legal Pages" 
      description="Manage content for fixed legal documents."
    >
      <div className="p-6">
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Page Title</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {pages.map((page) => (
                <tr key={page.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-50 flex items-center justify-center rounded-md border border-blue-100">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="font-medium text-gray-900">{page.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {page.description}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/pages/${page.slug}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                      <Edit2 className="h-4 w-4" /> Edit Content
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
