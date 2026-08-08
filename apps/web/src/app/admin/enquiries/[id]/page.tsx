'use client';

import { useState, useEffect } from 'react';
import { ContactsService } from '../../../../services/contacts.service';
import { AdminPage } from '../../../../components/admin/common/AdminPage';
import { Button } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { ArrowLeft, User, Phone, Mail, Globe, MapPin, Briefcase, GraduationCap, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function EnquiryDetailsPage({ params }: { params: { id: string } }) {
  const [enquiry, setEnquiry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchEnquiry = async () => {
    try {
      const res = await ContactsService.getContactById(params.id);
      if (res.success) {
        setEnquiry(res.data);
      }
    } catch (err) {
      toast.error('Failed to load enquiry details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiry();
  }, [params.id]);

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await ContactsService.updateStatus(params.id, newStatus);
      if (res.success) {
        toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
        setEnquiry({ ...enquiry, status: newStatus });
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Unexpected error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <AdminPage title="Enquiry Details" actions={<Link href="/admin/enquiries"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2"/> Back</Button></Link>}>
        <div className="p-6 text-gray-400">Loading details...</div>
      </AdminPage>
    );
  }

  if (!enquiry) {
    return (
      <AdminPage title="Enquiry Details" actions={<Link href="/admin/enquiries"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2"/> Back</Button></Link>}>
        <div className="p-6 text-gray-400">Enquiry not found.</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage 
      title={`Lead: ${enquiry.fullName}`} 
      description={`Manage this ${enquiry.source.toLowerCase()} lead.`}
      actions={
        <Link href="/admin/enquiries">
          <Button variant="outline" className="bg-[#252525] border-admin-card text-white hover:bg-admin-card">
            <ArrowLeft className="h-4 w-4 mr-2"/> Back to List
          </Button>
        </Link>
      }
    >
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-admin-bg border border-admin-card rounded-xl p-6">
            <h2 className="text-lg font-medium text-white mb-6 border-b border-admin-card pb-4">Personal Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-xs text-gray-400 uppercase tracking-wider mb-2">
                  <User className="h-3 w-3 mr-1" /> Full Name
                </label>
                <div className="text-white font-medium">{enquiry.fullName}</div>
              </div>
              <div>
                <label className="flex items-center text-xs text-gray-400 uppercase tracking-wider mb-2">
                  <Mail className="h-3 w-3 mr-1" /> Email
                </label>
                <div className="text-white font-medium">{enquiry.email}</div>
              </div>
              <div>
                <label className="flex items-center text-xs text-gray-400 uppercase tracking-wider mb-2">
                  <Phone className="h-3 w-3 mr-1" /> Phone Number
                </label>
                <div className="text-white font-medium">{enquiry.phoneNumber}</div>
              </div>
              <div>
                <label className="flex items-center text-xs text-gray-400 uppercase tracking-wider mb-2">
                  <Phone className="h-3 w-3 mr-1" /> WhatsApp Number
                </label>
                <div className="text-white font-medium">{enquiry.whatsappNumber || 'N/A'}</div>
              </div>
              <div>
                <label className="flex items-center text-xs text-gray-400 uppercase tracking-wider mb-2">
                  <Globe className="h-3 w-3 mr-1" /> Nationality
                </label>
                <div className="text-white font-medium">{enquiry.nationality}</div>
              </div>
              <div>
                <label className="flex items-center text-xs text-gray-400 uppercase tracking-wider mb-2">
                  <MapPin className="h-3 w-3 mr-1" /> Place
                </label>
                <div className="text-white font-medium">{enquiry.place}</div>
              </div>
            </div>
          </div>

          <div className="bg-admin-bg border border-admin-card rounded-xl p-6">
            <h2 className="text-lg font-medium text-white mb-6 border-b border-admin-card pb-4">Professional Background</h2>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-xs text-gray-400 uppercase tracking-wider mb-3">
                  <GraduationCap className="h-4 w-4 mr-1" /> Qualifications
                </label>
                <div className="flex flex-wrap gap-2">
                  {enquiry.qualifications?.length > 0 ? enquiry.qualifications.map((q: string) => (
                    <span key={q} className="bg-admin-card border border-[#333] text-gray-300 px-3 py-1.5 rounded-md text-sm">
                      {q}
                    </span>
                  )) : <span className="text-gray-400">None provided</span>}
                </div>
              </div>
              
              <div>
                <label className="flex items-center text-xs text-gray-400 uppercase tracking-wider mb-3">
                  <Briefcase className="h-4 w-4 mr-1" /> Experience
                </label>
                <div className="flex flex-wrap gap-2">
                  {enquiry.experience?.length > 0 ? enquiry.experience.map((e: string) => (
                    <span key={e} className="bg-admin-card border border-[#333] text-gray-300 px-3 py-1.5 rounded-md text-sm">
                      {e}
                    </span>
                  )) : <span className="text-gray-400">None provided</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <div className="bg-admin-bg border border-admin-card rounded-xl p-6">
            <h2 className="text-lg font-medium text-white mb-6 border-b border-admin-card pb-4">Lead Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Source</label>
                <div className="text-white font-medium">{enquiry.source === 'REGISTRATION' ? 'Registration Form' : 'Contact Form'}</div>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Submitted Date</label>
                <div className="text-white font-medium">
                  {new Date(enquiry.createdAt).toLocaleString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' 
                  })}
                </div>
              </div>
              
              <div className="pt-4 border-t border-admin-card">
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-4">Current Status</label>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => updateStatus('PENDING')}
                    disabled={isUpdating}
                    className={`w-full flex items-center p-3 rounded-lg border transition-all ${
                      enquiry.status === 'PENDING' 
                      ? 'border-admin-accent bg-admin-accent/10 text-admin-accent' 
                      : 'border-admin-card bg-admin-bg text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <Clock className="h-5 w-5 mr-3" />
                    <span className="font-medium">Pending</span>
                    {enquiry.status === 'PENDING' && <div className="ml-auto w-2 h-2 rounded-full bg-admin-accent animate-pulse" />}
                  </button>
                  
                  <button 
                    onClick={() => updateStatus('IN_PROGRESS')}
                    disabled={isUpdating}
                    className={`w-full flex items-center p-3 rounded-lg border transition-all ${
                      enquiry.status === 'IN_PROGRESS' 
                      ? 'border-blue-500 bg-[#18232c]0/10 text-blue-400' 
                      : 'border-admin-card bg-admin-bg text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <Briefcase className="h-5 w-5 mr-3" />
                    <span className="font-medium">In Progress</span>
                    {enquiry.status === 'IN_PROGRESS' && <div className="ml-auto w-2 h-2 rounded-full bg-[#18232c]0 animate-pulse" />}
                  </button>
                  
                  <button 
                    onClick={() => updateStatus('RESOLVED')}
                    disabled={isUpdating}
                    className={`w-full flex items-center p-3 rounded-lg border transition-all ${
                      enquiry.status === 'RESOLVED' 
                      ? 'border-green-500 bg-green-500/10 text-green-400' 
                      : 'border-admin-card bg-admin-bg text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span className="font-medium">Resolved</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <Toaster position="top-right" />
    </AdminPage>
  );
}
