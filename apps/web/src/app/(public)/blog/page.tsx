import { Metadata } from 'next';
import { BlogHero } from '../../../components/public/blog/BlogHero';
import { BlogIntro } from '../../../components/public/blog/BlogIntro';
import { BlogListSection } from '../../../components/public/blog/BlogListSection';

export const metadata: Metadata = {
  title: 'Blog | Intelligen Hirelinks',
  description: 'Our latest news at Intelligen Hirelinks.',
};

// Pulls blog posts straight from the database — force-dynamic re-fetches on
// every request instead of serving a build-time snapshot, so new/edited
// posts show up on refresh, not only after the next deploy.
export const dynamic = 'force-dynamic';

export default function BlogPage() {
  return (
    <div>
      <BlogHero />
      <BlogIntro />
      <BlogListSection />
    </div>
  );
}
