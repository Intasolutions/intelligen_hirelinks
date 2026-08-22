import { FaqAccordion, type FaqItem } from '../FaqAccordion';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What services does Intelligen Hirelinks offer?',
    answer:
      'We offer end-to-end recruitment process outsourcing, HR consulting, documentation support, credential evaluation, licensing exam preparation, and visa & relocation guidance for healthcare professionals.',
  },
  {
    question: 'How long does the placement process usually take?',
    answer:
      'Timelines vary by role and destination country, but most candidates move from application to placement within a few months once documentation and licensing requirements are complete.',
  },
  {
    question: 'Do you help with visa and relocation after placement?',
    answer:
      'Yes. Our team supports you through visa applications, travel arrangements, and relocation logistics so you can settle into your new role with minimal disruption.',
  },
  {
    question: 'Is there support for licensing exam preparation?',
    answer:
      'We provide structured guidance and resources for licensing exams such as the NCLEX, along with credential evaluation assistance to help you meet destination-country requirements.',
  },
  {
    question: 'How do I get started with Intelligen Hirelinks?',
    answer:
      'Reach out through our contact page or enquiry form, and our team will walk you through the services that best match your career goals and eligibility.',
  },
];

export function ServicesFaqSection() {
  return <FaqAccordion heading="Answers to Most Common Questions" headingAccent="Questions" items={FAQ_ITEMS} />;
}
