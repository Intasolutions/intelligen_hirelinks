import { FaqAccordion, type FaqItem } from '../../FaqAccordion';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How do I get started with this service?',
    answer: 'Reach out through our contact page or enquiry form and our team will walk you through eligibility, timelines, and next steps for this specific service.',
  },
  {
    question: 'How long does the whole process usually take?',
    answer: 'Timelines vary by individual circumstances and documentation, but most candidates move through the full process within a few months once everything is submitted.',
  },
  {
    question: 'What documents do I need to prepare in advance?',
    answer: 'Requirements differ by case, but having academic transcripts, identification documents, and any prior certifications ready speeds things up considerably.',
  },
  {
    question: 'Is there ongoing support after this stage is complete?',
    answer: 'Yes — our team stays available well past the point of completion, including for follow-up questions or issues that come up afterward.',
  },
  {
    question: 'Can I speak to someone who has gone through this before?',
    answer: 'We can connect you with past candidates or point you to relevant testimonials so you can hear directly about their experience with this service.',
  },
];

export function ServiceDetailFaqSection() {
  return <FaqAccordion heading="Frequently Asked Questions" headingAccent="Questions" items={FAQ_ITEMS} />;
}
