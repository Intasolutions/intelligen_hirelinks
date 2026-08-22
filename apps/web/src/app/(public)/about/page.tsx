import { Metadata } from 'next';
import { AboutHero } from '../../../components/public/about/AboutHero';
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
    </div>
  );
}
