import './globals.css';
import 'flag-icons/css/flag-icons.min.css';
import { Metadata } from 'next';
import { SettingsService } from '../services/settings.service';

// Favicon/OG image come from the admin-managed Settings record rather than
// a static file, since the client uploads these via Admin > Settings >
// Branding — generateMetadata (not a static export) is what lets Next.js
// fetch that value at request/build time and put it into <head>.
export async function generateMetadata(): Promise<Metadata> {
  let favicon: string | undefined;
  let ogImage: string | undefined;

  try {
    const res = await SettingsService.getSettings();
    if (res.success && res.data) {
      favicon = res.data.favicon || undefined;
      ogImage = res.data.defaultOgImage || undefined;
    }
  } catch {
    // Fall back to Next.js defaults if settings can't be reached.
  }

  return {
    title: 'Intelligen Hirelinks',
    description: 'Content Management Platform',
    icons: favicon ? { icon: favicon, shortcut: favicon, apple: favicon } : undefined,
    openGraph: ogImage ? { images: [ogImage] } : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
