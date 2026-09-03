import { Metadata } from 'next';
import { ProgramsFaqSection } from '../../../components/public/programs/ProgramsFaqSection';
import { ProgramsHero } from '../../../components/public/programs/ProgramsHero';
import { ProgramsIntro } from '../../../components/public/programs/ProgramsIntro';
import { ProgramsIntroduceSection } from '../../../components/public/programs/ProgramsIntroduceSection';
import { ProgramsListSection } from '../../../components/public/programs/ProgramsListSection';

export const metadata: Metadata = {
  title: 'Programs | Intelligen Hirelinks',
  description: 'Our popular programs at Intelligen Hirelinks.',
};

// Pulls programs straight from the database — force-dynamic re-fetches on
// every request instead of serving a build-time snapshot, so admin edits
// show up on refresh, not only after the next deploy.
export const dynamic = 'force-dynamic';

export default function ProgramsPage() {
  return (
    <div>
      <ProgramsHero />
      <ProgramsIntro />
      <ProgramsIntroduceSection />
      <ProgramsListSection />
      <ProgramsFaqSection />
    </div>
  );
}
