import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServicesService } from '../../../../services/services.service';
import { ServiceBenefitsSection } from '../../../../components/public/services/detail/ServiceBenefitsSection';
import { ServiceDetailHero } from '../../../../components/public/services/detail/ServiceDetailHero';
import { ServiceProcessSection } from '../../../../components/public/services/detail/ServiceProcessSection';
import { ServiceReviewsSection } from '../../../../components/public/services/detail/ServiceReviewsSection';

interface ServiceDetail {
  title: string;
  shortDescription: string;
  processDescription?: string;
  steps: { title: string; description?: string; icon?: string; displayOrder: number }[];
  benefits: { heading?: string; description?: string };
  benefitItems: { heading: string; description?: string; displayOrder: number }[];
  primaryImage?: { url: string; publicId: string };
  primaryImageAlt?: string;
  secondaryImage?: { url: string; publicId: string };
  secondaryImageAlt?: string;
  reviewSectionDescription?: string;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string };
}

async function getService(slug: string): Promise<ServiceDetail | null> {
  try {
    const res = await ServicesService.getServiceBySlug(slug);
    return (res.data ?? null) as ServiceDetail | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getService(params.slug);
  if (!service) return { title: 'Service | Intelligen Hirelinks' };

  return {
    title: service.seo?.metaTitle || `${service.title} | Intelligen Hirelinks`,
    description: service.seo?.metaDescription || service.shortDescription,
    keywords: service.seo?.keywords,
  };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);
  if (!service) notFound();

  return (
    <div>
      <ServiceDetailHero
        title={service.title}
        description={service.shortDescription}
        imageUrl={service.primaryImage?.url}
      />

      <ServiceProcessSection description={service.processDescription} steps={service.steps} />

      <ServiceBenefitsSection
        heading={service.benefits?.heading}
        description={service.benefits?.description}
        items={service.benefitItems}
        secondaryImageUrl={service.secondaryImage?.url}
        secondaryImageAlt={service.secondaryImageAlt}
      />

      <ServiceReviewsSection description={service.reviewSectionDescription} />
    </div>
  );
}
