import { SettingsService } from '../../services/settings.service';
import { Header } from '../../components/public/home/Header';
import { fhLecturis, fhLecturisRounded, helveticaNeue } from '../../fonts';

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

  return (
    <div
      className={`relative flex min-h-screen flex-col bg-white font-sans ${helveticaNeue.variable} ${fhLecturis.variable} ${fhLecturisRounded.variable}`}
    >
      <Header />

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
