import { Metadata } from 'next';
import { ContactHero } from '../../../components/public/contact/ContactHero';
import { ContactForm } from '../../../components/public/contact/ContactForm';
import { ContactFaqSection } from '../../../components/public/contact/ContactFaqSection';

export const metadata: Metadata = {
  title: 'Contact Us | Intelligen Hirelinks',
  description: 'Get in touch with Intelligen Hirelinks for general and careers enquiries.',
};

export default function ContactPage() {
  return (
    <div>
      <ContactHero />
      <ContactForm />
      <ContactFaqSection />
    </div>
  );
}
