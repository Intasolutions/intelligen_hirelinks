import { SettingsService } from '../../services/settings.service';
import { Header } from '../../components/public/home/Header';
import { Footer } from '../../components/public/home/Footer';
import { fhLecturis, fhLecturisRounded, helveticaNeue, leagueGothic } from '../../fonts';

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

  return (
    <div
      className={`relative flex min-h-screen flex-col bg-white font-sans ${helveticaNeue.variable} ${fhLecturis.variable} ${fhLecturisRounded.variable} ${leagueGothic.variable}`}
    >
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      <Footer settings={settings} />
    </div>
  );
}
