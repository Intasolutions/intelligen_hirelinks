import { Metadata } from 'next';
import { AboutHero } from '../../../components/public/about/AboutHero';
import { AboutIntroSection } from '../../../components/public/about/AboutIntroSection';
import { CertificationsSection } from '../../../components/public/about/CertificationsSection';
import { MissionVisionSection } from '../../../components/public/about/MissionVisionSection';

export const metadata: Metadata = {
  title: 'About | Intelligen Hirelinks',
  description: 'About Intelligen Hirelinks.',
};

export default function AboutPage() {
  return (
    <div>
      <AboutHero />
      <MissionVisionSection />
      <AboutIntroSection />
      <CertificationsSection />
    </div>
  );
}
