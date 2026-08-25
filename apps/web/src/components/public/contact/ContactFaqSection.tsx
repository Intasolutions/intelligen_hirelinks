import { FaqAccordion, type FaqItem } from '../FaqAccordion';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How quickly will I hear back after submitting the form?',
    answer:
      'Our team typically responds to general and careers enquiries within 1–2 business days. For urgent matters, feel free to call or WhatsApp us directly using the number above.',
  },
  {
    question: 'Can I reach out for both general and careers enquiries here?',
    answer:
      'Yes. Use the "For General Enquiries" email for questions about our services and programs, and "For Careers Enquiries" for job openings or working with Intelligen Hirelinks.',
  },
  {
    question: 'Do I need to select a service before submitting my message?',
    answer:
      '"Service Interested In" is optional — it just helps us route your message to the right team faster. You can leave it blank if you\'re not sure or have a general question.',
  },
  {
    question: 'Is there an office I can visit in person?',
    answer:
      'Yes, our office address is listed above. We recommend reaching out beforehand to schedule a visit so the right team member is available to meet you.',
  },
  {
    question: 'What happens after I submit the contact form?',
    answer:
      'Your message is sent directly to our team, who will review it and follow up by email or phone using the details you provided.',
  },
];

export function ContactFaqSection() {
  return <FaqAccordion heading="Answers to Most Common Questions" headingAccent="Questions" items={FAQ_ITEMS} />;
}
