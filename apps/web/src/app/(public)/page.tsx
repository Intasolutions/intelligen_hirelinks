import { Hero } from '../../components/public/home/Hero';
import { LoadingScreen } from '../../components/public/LoadingScreen';
import { PageReadyProvider } from '../../components/public/PageReadyContext';

export default async function PublicHomePage() {
  return (
    <PageReadyProvider expectedCount={1}>
      <LoadingScreen />
      <div>
        <Hero />
      </div>
    </PageReadyProvider>
  );
}
