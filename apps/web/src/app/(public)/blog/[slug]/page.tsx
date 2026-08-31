import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { BlogsService } from '../../../../services/blogs.service';
import { SetWhatsAppMessage } from '../../../../components/public/WhatsAppMessageContext';
import { BlogDetailHero } from '../../../../components/public/blog/detail/BlogDetailHero';
import { NewsSection } from '../../../../components/public/home/NewsSection';

interface BlogDetail {
  title: string;
  subTitle?: string;
  tags: string[];
  excerpt: string;
  content: string;
  image?: { url: string; publicId: string };
  coverImageAlt?: string;
  publishedAt?: string | null;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string };
}

async function getBlog(slug: string): Promise<BlogDetail | null> {
  try {
    const res = await BlogsService.getBlogBySlug(slug);
    return (res.data ?? null) as BlogDetail | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlog(params.slug);
  if (!blog) return { title: 'Blog | Intelligen Hirelinks' };

  return {
    title: blog.seo?.metaTitle || `${blog.title} | Intelligen Hirelinks`,
    description: blog.seo?.metaDescription || blog.excerpt,
    keywords: blog.seo?.keywords,
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);
  if (!blog) notFound();

  // TipTap saves raw HTML — sanitize before dangerouslySetInnerHTML, same
  // pattern the privacy-policy/terms pages already use for admin-authored
  // rich text.
  const safeHtml = DOMPurify.sanitize(blog.content || '');

  return (
    <div>
      <SetWhatsAppMessage message={`Hi! I read your blog post "${blog.title}" and wanted to get in touch.`} />

      <BlogDetailHero
        title={blog.title}
        subTitle={blog.subTitle || blog.excerpt}
        tags={blog.tags}
        publishedAt={blog.publishedAt}
        imageUrl={blog.image?.url}
        imageAlt={blog.coverImageAlt}
      />

      <section className="w-full bg-white px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10 lg:pb-16">
        <div
          className="prose prose-sm mx-auto max-w-3xl sm:prose-base lg:prose-lg prose-headings:font-display-rounded prose-a:text-[#2a9d8f]"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </section>

      <NewsSection />
    </div>
  );
}
