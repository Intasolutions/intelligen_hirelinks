import { SettingsService } from '../../services/settings.service';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let settings = null;
  try {
    const res = await SettingsService.getSettings();
    if (res.success) {
      settings = res.data;
    }
  } catch (err) {
    console.error('Failed to load settings', err);
  }

  const companyName = settings?.companyName || 'Intelligen Hirelinks';
  const logoUrl = settings?.logo || null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Public Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="h-8 object-contain" />
            ) : (
              <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                {companyName.charAt(0)}
              </div>
            )}
            <span className="text-xl font-bold tracking-tight text-gray-900">{companyName}</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Home</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Services</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Blog</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Public Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-12 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <span className="text-lg font-bold text-gray-900">{companyName}</span>
            <p className="mt-4 text-sm text-gray-500">
              'Empowering businesses with modern digital solutions.'
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              {settings?.companyEmail && (
                <li>Email: <a href={`mailto:${settings.companyEmail}`} className="hover:text-blue-600">{settings.companyEmail}</a></li>
              )}
              {settings?.companyPhone && (
                <li>Phone: {settings.companyPhone}</li>
              )}
              {settings?.addresses && settings.addresses.length > 0 && (
                <li>Address: {settings.addresses.find((a: any) => a.isPrimary)?.address || settings.addresses[0].address}</li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-400">
            {`© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}
          </p>
        </div>
      </footer>
    </div>
  );
}
