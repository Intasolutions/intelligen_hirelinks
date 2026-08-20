import { AboutUsSection } from '../../components/public/home/AboutUsSection';
import { DomesticPartnersSection } from '../../components/public/home/DomesticPartnersSection';
import { Hero } from '../../components/public/home/Hero';
import { PartnersSection } from '../../components/public/home/PartnersSection';
import { ProgramsSection } from '../../components/public/home/ProgramsSection';
import { ServicesSection } from '../../components/public/home/ServicesSection';
import { StatsSection } from '../../components/public/home/StatsSection';
import { WhyChooseUsSection } from '../../components/public/home/WhyChooseUsSection';
import { LoadingScreen } from '../../components/public/LoadingScreen';
import { PageReadyProvider } from '../../components/public/PageReadyContext';

export default async function PublicHomePage() {
  return (
    <PageReadyProvider expectedCount={2}>
      <LoadingScreen />
      <div>
        <Hero />
        <StatsSection />
        <PartnersSection />
        <DomesticPartnersSection />
        <ServicesSection />
        <ProgramsSection />
        <AboutUsSection />
        <WhyChooseUsSection />
      </div>
    </PageReadyProvider>
  );
}
