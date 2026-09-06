import { FaqAccordion, type FaqItem } from '../FaqAccordion';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is HireLinks?',
    answer: 'HireLinks is a nursing career, recruitment, and placement platform connecting qualified nurses with suitable career opportunities.',
  },
  {
    question: 'What services does HireLinks provide?',
    answer: 'We provide career guidance, profile assessment, documentation, credential support, licensing guidance, interview preparation, recruitment, placement, and relocation support.',
  },
  {
    question: 'Who can benefit from HireLinks?',
    answer: 'Our services support nursing students, fresh graduates, experienced nurses, and healthcare professionals seeking better career opportunities.',
  },
  {
    question: 'Do you provide domestic and international placement opportunities?',
    answer: 'Yes. We support nurses seeking suitable career and employment opportunities in both domestic and international healthcare markets.',
  },
  {
    question: 'How does HireLinks support nurses?',
    answer: 'We guide nurses throughout their career journey, from profile assessment and documentation to interview preparation, recruitment coordination, and placement.',
  },
  {
    question: 'Do you provide nursing licensing guidance?',
    answer: 'Yes. We provide guidance for relevant nursing licensing pathways and help candidates understand requirements and preparation processes.',
  },
  {
    question: 'Do you support healthcare employers with recruitment?',
    answer: 'Yes. We help healthcare employers identify, screen, coordinate, and recruit qualified nursing professionals.',
  },
  {
    question: 'Why should nurses choose HireLinks?',
    answer: 'We bring career guidance, recruitment, documentation, and placement support together through one coordinated process designed specifically for nurses.',
  },
  {
    question: 'What is the mission of HireLinks?',
    answer: 'Our mission is to empower nurses with the right guidance and opportunities while helping healthcare organizations connect with skilled nursing professionals.',
  },
  {
    question: 'How can I get started with HireLinks?',
    answer: 'Simply contact our team and share your career goals and professional background. We will guide you toward the most suitable pathway.',
  },
];

export function FaqSection() {
  return <FaqAccordion heading="Answers to Most Common Questions" headingAccent="Questions" items={FAQ_ITEMS} />;
}
