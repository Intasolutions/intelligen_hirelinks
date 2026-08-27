import { Suspense } from 'react';
import { BlogsService } from '../../../services/blogs.service';
import { BlogGrid, type BlogListItem } from './BlogGrid';
import { BlogSearchBar } from './BlogSearchBar';

async function BlogGridData() {
  let blogs: BlogListItem[] = [];

  try {
    const res = await BlogsService.getPublicBlogs({ limit: 20 });
    blogs = (res.data ?? []) as BlogListItem[];
  } catch {
    // Public section — fail quietly rather than breaking the whole blog
    // page if the API is unreachable; the grid just renders nothing.
    blogs = [];
  }

  return <BlogGrid blogs={blogs} />;
}

// BlogSearchBar uses useSearchParams(), which requires a Suspense boundary
// visible directly in a page's synchronous render tree to be correctly
// detected as a CSR bailout by Next's static export analysis — nesting it
// inside an async server component (as the previous single-component
// version did) isn't reliably picked up, so the boundary lives in this
// plain (non-async) component instead.
export function BlogListSection() {
  return (
    <section className="w-full overflow-x-hidden bg-white px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10 lg:pb-20">
      <div className="mx-auto max-w-[1360px]">
        <div className="mx-auto max-w-2xl">
          <Suspense fallback={null}>
            <BlogSearchBar />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <BlogGridData />
        </Suspense>
      </div>
    </section>
  );
}
