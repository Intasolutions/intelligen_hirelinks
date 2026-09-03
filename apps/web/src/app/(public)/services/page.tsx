import { Metadata } from 'next';
import { PopularServicesSection } from '../../../components/public/services/PopularServicesSection';
import { ServicesFaqSection } from '../../../components/public/services/ServicesFaqSection';
import { ServicesHero } from '../../../components/public/services/ServicesHero';
import { ServicesIntro } from '../../../components/public/services/ServicesIntro';
import { WeProvideSection } from '../../../components/public/services/WeProvideSection';

export const metadata: Metadata = {
  title: 'Services | Intelligen Hirelinks',
  description: 'Our valuable services at Intelligen Hirelinks.',
};

// Pulls services straight from the database — force-dynamic re-fetches on
// every request instead of serving a build-time snapshot, so admin edits
// show up on refresh, not only after the next deploy.
export const dynamic = 'force-dynamic';

export default function ServicesPage() {
  return (
    <div>
      <ServicesHero />
      <ServicesIntro />
      <WeProvideSection />
      <PopularServicesSection />
      <ServicesFaqSection />
    </div>
  );
}
