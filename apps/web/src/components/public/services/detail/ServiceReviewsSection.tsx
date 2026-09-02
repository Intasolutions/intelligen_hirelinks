import { ReviewsService } from '../../../../services/reviews.service';
import { TestimonialsCarousel, type Testimonial } from '../../home/TestimonialsCarousel';

interface ServiceReviewsSectionProps {
  /** Which detail page this is rendering on — picks the right scoped review query. */
  type: 'SERVICE' | 'PROGRAM';
  slug: string;
  description?: string;
}

export async function ServiceReviewsSection({ type, slug, description }: ServiceReviewsSectionProps) {
  let testimonials: Testimonial[] = [];

  try {
    const res = type === 'SERVICE'
      ? await ReviewsService.getReviewsByServiceSlug(slug)
      : await ReviewsService.getReviewsByProgramSlug(slug);
    testimonials = (res.data ?? []) as Testimonial[];
  } catch {
    // Public section — fail quietly rather than breaking the service page if
    // the API is unreachable; the carousel just renders nothing.
    testimonials = [];
  }

  return <TestimonialsCarousel testimonials={testimonials} description={description} />;
}
