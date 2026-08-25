import { Metadata } from 'next';
import { BlogHero } from '../../../components/public/blog/BlogHero';
import { BlogIntro } from '../../../components/public/blog/BlogIntro';
import { BlogListSection } from '../../../components/public/blog/BlogListSection';

export const metadata: Metadata = {
  title: 'Blog | Intelligen Hirelinks',
  description: 'Our latest news at Intelligen Hirelinks.',
};

export default function BlogPage() {
  return (
    <div>
      <BlogHero />
      <BlogIntro />
      <BlogListSection />
    </div>
  );
}
