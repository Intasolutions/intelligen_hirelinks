import { FaqAccordion, type FaqItem } from '../FaqAccordion';

const FAQ_ANSWER =
  'Lorem ipsum dolor sit amet consectetur. At quisque nunc tellus massa sit amet. Volutpat condimentum mattis sollicitudin ultricies nisl est tellus.Lorem ipsum dolor sit amet consectetur. At quisque nunc tellus massa sit amet. Volutpat condimentum mattis sollicitudin.';

const FAQ_ITEMS: FaqItem[] = [
  { question: 'Lorem ipsum dolor sit amet consectetur. At quisque nunc tellus massa sit amet.', answer: FAQ_ANSWER },
  { question: 'Lorem ipsum dolor sit amet consectetur. At quisque nunc tellus massa sit amet.', answer: FAQ_ANSWER },
  { question: 'Lorem ipsum dolor sit amet consectetur. At quisque nunc tellus massa sit amet.', answer: FAQ_ANSWER },
  { question: 'Lorem ipsum dolor sit amet consectetur. At quisque nunc tellus massa sit amet.', answer: FAQ_ANSWER },
  { question: 'Lorem ipsum dolor sit amet consectetur. At quisque nunc tellus massa sit amet.', answer: FAQ_ANSWER },
];

export function FaqSection() {
  return <FaqAccordion heading="Answers to Most Common Questions" headingAccent="Questions" items={FAQ_ITEMS} />;
}
