import { Metadata } from 'next';
import { AboutHero } from '../../../components/public/about/AboutHero';
import { AboutIntroSection } from '../../../components/public/about/AboutIntroSection';
import { CertificationsSection } from '../../../components/public/about/CertificationsSection';
import { CoreValuesSection } from '../../../components/public/about/CoreValuesSection';
import { FaqSection } from '../../../components/public/about/FaqSection';
import { FeaturedStudentsSection } from '../../../components/public/about/FeaturedStudentsSection';
import { MissionVisionSection } from '../../../components/public/about/MissionVisionSection';

export const metadata: Metadata = {
  title: 'About | Intelligen Hirelinks',
  description: 'About Intelligen Hirelinks.',
};

// Pulls certification logos and featured students straight from the
// database — force-dynamic re-fetches on every request instead of serving
// a build-time snapshot, so admin edits show up on refresh, not only after
// the next deploy.
export const dynamic = 'force-dynamic';

export default function AboutPage() {
  return (
    <div>
      <AboutHero />
      <MissionVisionSection />
      <AboutIntroSection />
      <CertificationsSection />
      <CoreValuesSection />
      <FeaturedStudentsSection />
      <FaqSection />
    </div>
  );
}
