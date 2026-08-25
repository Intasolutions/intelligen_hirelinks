import { FaqAccordion, type FaqItem } from '../FaqAccordion';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What programs does Intelligen Hirelinks offer?',
    answer:
      'We offer nurse pre-enrolment preparation, licensing exam preparation, international student counselling, credential evaluation, and relocation & settlement programs for candidates moving abroad.',
  },
  {
    question: 'How do I choose the right program for me?',
    answer:
      'Reach out through our contact page or enquiry form and our team will assess your background and goals to recommend the program that fits your situation.',
  },
  {
    question: 'How long does a typical program take to complete?',
    answer:
      'Timelines vary by program and individual circumstances, but most candidates complete a program within a few months once enrolment and documentation are finalized.',
  },
  {
    question: 'Can I enrol in more than one program at a time?',
    answer:
      'Yes — many candidates combine programs, such as licensing exam preparation alongside credential evaluation, to move through the process more efficiently.',
  },
  {
    question: 'Is there support available after a program ends?',
    answer:
      'Our team stays available well past completion, including for follow-up questions, additional guidance, or issues that come up afterward.',
  },
];

export function ProgramsFaqSection() {
  return <FaqAccordion heading="Answers to Most Common Questions" headingAccent="Questions" items={FAQ_ITEMS} />;
}
