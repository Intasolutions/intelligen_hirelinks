import { Metadata } from 'next';
import { ContactHero } from '../../../components/public/contact/ContactHero';
import { ContactForm } from '../../../components/public/contact/ContactForm';
import { ContactFaqSection } from '../../../components/public/contact/ContactFaqSection';

export const metadata: Metadata = {
  title: 'Contact Us | Intelligen Hirelinks',
  description: 'Get in touch with Intelligen Hirelinks for general and careers enquiries.',
};

// Pulls contact details straight from Settings — force-dynamic re-fetches
// on every request instead of serving a build-time snapshot, so admin edits
// (email/phone/address) show up on refresh, not only after the next deploy.
export const dynamic = 'force-dynamic';

export default function ContactPage() {
  return (
    <div>
      <ContactHero />
      <ContactForm />
      <ContactFaqSection />
    </div>
  );
}
