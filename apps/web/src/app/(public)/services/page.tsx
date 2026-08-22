import { Metadata } from 'next';
import { ServicesHero } from '../../../components/public/services/ServicesHero';
import { ServicesIntro } from '../../../components/public/services/ServicesIntro';
import { WeProvideSection } from '../../../components/public/services/WeProvideSection';

export const metadata: Metadata = {
  title: 'Services | Intelligen Hirelinks',
  description: 'Our valuable services at Intelligen Hirelinks.',
};

export default function ServicesPage() {
  return (
    <div>
      <ServicesHero />
      <ServicesIntro />
      <WeProvideSection />
    </div>
  );
}
