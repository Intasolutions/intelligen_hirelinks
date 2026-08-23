import { ReviewsService } from '../../../../services/reviews.service';
import { TestimonialsCarousel, type Testimonial } from '../../home/TestimonialsCarousel';

export async function ServiceReviewsSection({ description }: { description?: string }) {
  let testimonials: Testimonial[] = [];

  try {
    const res = await ReviewsService.getFeaturedReviews();
    testimonials = (res.data ?? []) as Testimonial[];
  } catch {
    // Public section — fail quietly rather than breaking the service page if
    // the API is unreachable; the carousel just renders nothing.
    testimonials = [];
  }

  return <TestimonialsCarousel testimonials={testimonials} description={description} />;
}
