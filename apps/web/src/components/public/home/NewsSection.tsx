import { BlogsService } from '../../../services/blogs.service';
import { NewsCarousel, type NewsPost } from './NewsCarousel';

export async function NewsSection() {
  let posts: NewsPost[] = [];

  try {
    const res = await BlogsService.getPublicBlogs({ limit: 10 });
    posts = (res.data ?? []) as NewsPost[];
  } catch {
    // Public section — fail quietly rather than breaking the whole homepage
    // if the API is unreachable; the carousel just renders nothing.
    posts = [];
  }

  return <NewsCarousel posts={posts} />;
}
