import { AboutUsSection } from '../../components/public/home/AboutUsSection';
import { DomesticPartnersSection } from '../../components/public/home/DomesticPartnersSection';
import { Hero } from '../../components/public/home/Hero';
import { MissionSection } from '../../components/public/home/MissionSection';
import { NewsSection } from '../../components/public/home/NewsSection';
import { PartnersSection } from '../../components/public/home/PartnersSection';
import { ProgramsSection, FeaturedProgram } from '../../components/public/home/ProgramsSection';
import { ServicesSection } from '../../components/public/home/ServicesSection';
import { StatsSection } from '../../components/public/home/StatsSection';
import { TestimonialsSection } from '../../components/public/home/TestimonialsSection';
import { WhyChooseUsSection } from '../../components/public/home/WhyChooseUsSection';
import { LoadingScreen } from '../../components/public/LoadingScreen';
import { PageReadyProvider } from '../../components/public/PageReadyContext';
import { ProgramsService } from '../../services/programs.service';

// This page pulls services/programs/reviews/partner logos/settings straight
// from the database — forcing it dynamic means every request re-fetches
// fresh data instead of serving a build-time snapshot, so admin edits show
// up on the next page refresh rather than only after the next deploy.
export const dynamic = 'force-dynamic';

async function getFeaturedPrograms(): Promise<FeaturedProgram[]> {
  try {
    const res = await ProgramsService.getPublicPrograms();
    const programs = (res.data ?? []) as any[];
    return programs.slice(0, 4).map((p) => ({ title: p.title, slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function PublicHomePage() {
  const featuredPrograms = await getFeaturedPrograms();

  return (
    <PageReadyProvider expectedCount={2}>
      <LoadingScreen />
      <div>
        <Hero />
        <StatsSection />
        <PartnersSection />
        <DomesticPartnersSection />
        <ServicesSection />
        <ProgramsSection programs={featuredPrograms} />
        <AboutUsSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <MissionSection />
        <NewsSection />
      </div>
    </PageReadyProvider>
  );
}
