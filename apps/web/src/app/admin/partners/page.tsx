'use client';

import { useState, useEffect } from 'react';
import { PartnerLogosService } from '../../../services/partner-logos.service';
import { AdminPage } from '../../../components/admin/common/AdminPage';
import { Button, Tabs, TabsList, TabsTrigger } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

type Category = 'DOMESTIC' | 'INTERNATIONAL' | 'CERTIFICATION';

const TABS: { value: Category; label: string; description: string }[] = [
  { value: 'DOMESTIC', label: 'Domestic Partners', description: 'Logos shown in the homepage "Our Domestic Partners" section.' },
  { value: 'INTERNATIONAL', label: 'International Partners', description: 'Logos shown in the homepage "Our International Partners" section.' },
  { value: 'CERTIFICATION', label: 'Certifications & Affiliations', description: 'Logos shown in the About page "Certifications & Affiliations" section.' },
];

export default function PartnerLogosPage() {
  const [category, setCategory] = useState<Category>('DOMESTIC');
  const [logos, setLogos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogos = async () => {
    setIsLoading(true);
    try {
      const res = await PartnerLogosService.listPartnerLogos({ category, limit: 100 });
      if (res.success) {
        setLogos(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load logos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this logo?')) return;

    try {
      const res = await PartnerLogosService.deletePartnerLogo(id);
      if (res.success) {
        toast.success('Logo deleted');
        fetchLogos();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('Unexpected error');
    }
  };

  const activeTab = TABS.find((t) => t.value === category)!;

  return (
    <AdminPage
      title="Partners & Certifications"
      description="Manage the domestic partner, international partner, and certification logos shown across the public site."
      actions={
        <Link href={`/admin/partners/new?category=${category}`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Logo
          </Button>
        </Link>
      }
    >
      <div className="p-6">
        <Tabs value={category} onValueChange={(v) => setCategory(v as Category)} className="w-full">
          <TabsList className="mb-6 overflow-x-auto whitespace-nowrap flex max-w-full justify-start w-max">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <p className="mb-6 text-sm text-gray-400">{activeTab.description}</p>

        <div className="overflow-x-auto rounded-md border border-admin-card">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-admin-card text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Logo</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Display Order</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-card bg-admin-bg">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading logos...</td>
                </tr>
              ) : logos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No logos found.</td>
                </tr>
              ) : (
                logos.map((logo) => (
                  <tr key={logo._id} className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4">
                      {logo.logo?.url ? (
                        <img src={logo.logo.url} alt={logo.name} className="h-10 w-20 object-contain rounded border border-admin-card bg-white p-1" />
                      ) : (
                        <div className="h-10 w-20 bg-admin-card flex items-center justify-center rounded border border-admin-card text-gray-500 text-xs">
                          No logo
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{logo.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        logo.status === 'ACTIVE' ? 'bg-admin-accent/10 text-admin-accent' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {logo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{logo.displayOrder}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/partners/${logo._id}`} className="p-1 text-gray-400 hover:text-white bg-admin-card rounded transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(logo._id)} className="p-1 text-red-400 hover:text-red-300 bg-red-900/20 rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Toaster position="top-right" />
    </AdminPage>
  );
}
