import { FaqAccordion, type FaqItem } from '../../FaqAccordion';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How do I get started with this program?',
    answer: 'Reach out through our contact page or enquiry form and our team will walk you through eligibility, timelines, and next steps for this specific program.',
  },
  {
    question: 'How long does the whole program usually take?',
    answer: 'Timelines vary by individual circumstances and documentation, but most candidates complete the full program within a few months once everything is submitted.',
  },
  {
    question: 'What documents do I need to prepare in advance?',
    answer: 'Requirements differ by case, but having academic transcripts, identification documents, and any prior certifications ready speeds things up considerably.',
  },
  {
    question: 'Is there ongoing support after this program is complete?',
    answer: 'Yes — our team stays available well past the point of completion, including for follow-up questions or issues that come up afterward.',
  },
  {
    question: 'Can I speak to someone who has gone through this program before?',
    answer: 'We can connect you with past candidates or point you to relevant testimonials so you can hear directly about their experience with this program.',
  },
];

export function ProgramDetailFaqSection() {
  return <FaqAccordion heading="Frequently Asked Questions" headingAccent="Questions" items={FAQ_ITEMS} />;
}
