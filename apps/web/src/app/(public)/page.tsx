import { SettingsService } from '../../services/settings.service';
import { Button } from '@hirelinks/ui';
import Link from 'next/link';

export default async function PublicHomePage() {
  let companyName = 'Intelligen';
  
  try {
    const res = await SettingsService.getSettings();
    if (res.success && res.data) {
      companyName = res.data.companyName;
    }
  } catch (err) {}

  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <div className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 mb-6">
        Platform Launch
      </div>
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl max-w-4xl">
        Welcome to <span className="text-blue-600">{companyName}</span>
      </h1>
      <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
        This is the public-facing website. The header and footer are dynamically driven by the Global Settings module configured in the Admin panel.
      </p>
      
      <div className="mt-10 flex gap-4">
        <Link href="/admin/settings">
          <Button size="lg" className="h-12 px-8">Edit Settings</Button>
        </Link>
      </div>
    </div>
  );
}
