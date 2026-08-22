import { Metadata } from 'next';
import { ServicesHero } from '../../../components/public/services/ServicesHero';
import { ServicesIntro } from '../../../components/public/services/ServicesIntro';

export const metadata: Metadata = {
  title: 'Services | Intelligen Hirelinks',
  description: 'Our valuable services at Intelligen Hirelinks.',
};

export default function ServicesPage() {
  return (
    <div>
      <ServicesHero />
      <ServicesIntro />
    </div>
  );
}
