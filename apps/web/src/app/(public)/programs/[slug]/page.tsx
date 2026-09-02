import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProgramsService } from '../../../../services/programs.service';
import { SetWhatsAppMessage } from '../../../../components/public/WhatsAppMessageContext';
import { ProgramDetailFaqSection } from '../../../../components/public/programs/detail/ProgramDetailFaqSection';
// Reused verbatim from the service detail page — same data shape (Program
// and Service models are identical), so the components themselves need no
// changes, only the data fed into them differs.
import { ServiceBenefitsSection } from '../../../../components/public/services/detail/ServiceBenefitsSection';
import { ServiceDetailHero } from '../../../../components/public/services/detail/ServiceDetailHero';
import { ServiceProcessSection } from '../../../../components/public/services/detail/ServiceProcessSection';
import { ServiceReviewsSection } from '../../../../components/public/services/detail/ServiceReviewsSection';

interface ProgramDetail {
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

async function getProgram(slug: string): Promise<ProgramDetail | null> {
  try {
    const res = await ProgramsService.getProgramBySlug(slug);
    return (res.data ?? null) as ProgramDetail | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const program = await getProgram(params.slug);
  if (!program) return { title: 'Program | Intelligen Hirelinks' };

  return {
    title: program.seo?.metaTitle || `${program.title} | Intelligen Hirelinks`,
    description: program.seo?.metaDescription || program.shortDescription,
    keywords: program.seo?.keywords,
  };
}

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const program = await getProgram(params.slug);
  if (!program) notFound();

  return (
    <div>
      <SetWhatsAppMessage message={`Hi! I'm interested in the "${program.title}" program and would like more details.`} />

      <ServiceDetailHero
        title={program.title}
        description={program.shortDescription}
        imageUrl={program.primaryImage?.url}
      />

      <ServiceProcessSection description={program.processDescription} steps={program.steps} />

      <ServiceBenefitsSection
        heading={program.benefits?.heading}
        description={program.benefits?.description}
        items={program.benefitItems}
        secondaryImageUrl={program.secondaryImage?.url}
        secondaryImageAlt={program.secondaryImageAlt}
      />

      <ServiceReviewsSection type="PROGRAM" slug={params.slug} description={program.reviewSectionDescription} />

      <ProgramDetailFaqSection />
    </div>
  );
}
