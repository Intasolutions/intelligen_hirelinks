import { Hero } from '../../components/public/home/Hero';
import { StatsSection } from '../../components/public/home/StatsSection';
import { LoadingScreen } from '../../components/public/LoadingScreen';
import { PageReadyProvider } from '../../components/public/PageReadyContext';

export default async function PublicHomePage() {
  return (
    <PageReadyProvider expectedCount={2}>
      <LoadingScreen />
      <div>
        <Hero />
        <StatsSection />
      </div>
    </PageReadyProvider>
  );
}
