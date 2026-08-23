import { Metadata } from 'next';
import { ProgramsHero } from '../../../components/public/programs/ProgramsHero';
import { ProgramsIntro } from '../../../components/public/programs/ProgramsIntro';

export const metadata: Metadata = {
  title: 'Programs | Intelligen Hirelinks',
  description: 'Our popular programs at Intelligen Hirelinks.',
};

export default function ProgramsPage() {
  return (
    <div>
      <ProgramsHero />
      <ProgramsIntro />
    </div>
  );
}
