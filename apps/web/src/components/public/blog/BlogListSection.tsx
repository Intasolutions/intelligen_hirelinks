import { BlogsService } from '../../../services/blogs.service';
import { BlogGrid, type BlogListItem } from './BlogGrid';
import { BlogSearchBar } from './BlogSearchBar';

export async function BlogListSection() {
  let blogs: BlogListItem[] = [];

  try {
    const res = await BlogsService.getPublicBlogs({ limit: 20 });
    blogs = (res.data ?? []) as BlogListItem[];
  } catch {
    // Public section — fail quietly rather than breaking the whole blog
    // page if the API is unreachable; the grid just renders nothing.
    blogs = [];
  }

  return (
    <section className="w-full overflow-x-hidden bg-white px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10 lg:pb-20">
      <div className="mx-auto max-w-[1360px]">
        <div className="mx-auto max-w-2xl">
          <BlogSearchBar />
        </div>

        <BlogGrid blogs={blogs} />
      </div>
    </section>
  );
}
