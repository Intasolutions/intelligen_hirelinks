'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { PillButton } from '../PillButton';

export interface BlogListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: { url: string; publicId: string };
  publishedAt?: string | null;
  createdAt: string;
}

function formatDate(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function BlogCard({ blog, delay }: { blog: BlogListItem; delay: number }) {
  return (
    // Padding, image ratio, and text sizes all trimmed ~25% from the
    // original (p-4/p-6 -> p-3/p-4.5, aspect-[4/3] -> aspect-[16/10] for a
    // shorter image, base/lg text -> sm/base) so each card's overall
    // footprint shrinks proportionally rather than just one dimension.
    <FadeInWhenVisible delay={delay} className="flex flex-col gap-3 p-3 sm:gap-3 sm:p-[18px]">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#ececec]">
        {blog.image?.url && (
          <Image
            src={blog.image.url}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <p className="line-clamp-2 max-w-md font-sans text-sm font-semibold leading-snug text-black sm:text-base">
          {blog.title}
        </p>
        <div className="mt-0.5 shrink-0">
          <PillButton href={`/blog/${blog.slug}`} variant="solid" bgColor="#000000" textColor="#ffffff">
            Read Story
          </PillButton>
        </div>
      </div>

      <p className="font-sans text-xs text-black/50 sm:text-sm">{formatDate(blog.publishedAt ?? blog.createdAt)}</p>
    </FadeInWhenVisible>
  );
}

export function BlogGrid({ blogs }: { blogs: BlogListItem[] }) {
  const searchParams = useSearchParams();
  const search = (searchParams.get('search') ?? '').trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!search) return blogs;
    return blogs.filter(
      (b) => b.title.toLowerCase().includes(search) || b.excerpt?.toLowerCase().includes(search)
    );
  }, [blogs, search]);

  if (blogs.length === 0) return null;

  if (filtered.length === 0) {
    return (
      <p className="mt-8 text-center font-sans text-sm text-black/60 sm:mt-10">
        No posts match &ldquo;{searchParams.get('search')}&rdquo;.
      </p>
    );
  }

  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white sm:mt-10">
      {/* Every internal line is an explicit border on the cell that owns it
          — same approach ServiceBenefitsSection uses for its numbered
          grid, so this reads as the same "bordered box" visual language.
          Below sm: single column, every cell after the first gets a top
          border. At sm: 2-column — left-column cells get a right border,
          every cell from the second row on gets a top border. */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {filtered.map((blog, i) => (
          <div
            key={blog._id}
            className={`border-[#e5e5e5] ${i > 0 ? 'border-t' : ''} ${i % 2 === 0 ? 'sm:border-r' : ''} ${
              i >= 2 ? 'sm:border-t' : 'sm:border-t-0'
            }`}
          >
            <BlogCard blog={blog} delay={Math.min(i, 5) * 0.05} />
          </div>
        ))}
      </div>
    </div>
  );
}
