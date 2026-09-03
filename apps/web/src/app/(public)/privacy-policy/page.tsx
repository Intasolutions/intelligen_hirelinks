import { Metadata } from 'next';
import DOMPurify from 'isomorphic-dompurify';
import { getApiBaseUrl } from '../../../lib/api-client';

export const metadata: Metadata = {
  title: 'Privacy Policy | Intelligen Hirelinks',
  description: 'Privacy Policy for Intelligen Hirelinks platform.',
};

// Was on ISR (revalidate: 60), but Vercel appears to have permanently
// cached a stale/broken static fallback for this route that survived
// multiple clean redeploys — force-dynamic removes any static-generation
// ambiguity by always rendering fresh server-side, matching every other
// public page in this app.
export const dynamic = 'force-dynamic';

async function getPrivacyPolicy() {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/pages/privacy-policy`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    return null;
  }
}

export default async function PrivacyPolicyPage() {
  const page = await getPrivacyPolicy();
  
  if (!page) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <p className="text-gray-500">Privacy Policy content is currently unavailable.</p>
      </div>
    );
  }

  // Sanitize the HTML before rendering
  const safeHtml = DOMPurify.sanitize(page.content || '');

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {page.image?.url && (
          <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-12 shadow-md">
            <img 
              src={page.image.url} 
              alt={page.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            {page.title}
          </h1>
          {page.updatedAt && (
            <p className="mt-4 text-sm text-gray-500">
              Last updated: {new Date(page.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>

        <div 
          className="prose prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
        
      </div>
    </div>
  );
}
