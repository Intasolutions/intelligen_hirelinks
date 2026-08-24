import mongoose from 'mongoose';
import slugify from 'slugify';
import { User } from '../modules/users/user.model';
import { Program } from '../modules/programs/program.model';
import { env } from '../config/env';

const DUMMY_PROGRAMS = [
  {
    title: 'International Nurse Pre-Enrolment Program',
    shortDescription:
      'A structured pathway that prepares nursing candidates for enrolment abroad, covering documentation, orientation, and readiness assessment before departure.',
    primaryImage: { url: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&h=800&fit=crop', publicId: 'seed_nurse-pre-enrolment' },
    displayOrder: 1,
  },
  {
    title: 'Global Nursing Licensing Exam Preparation',
    shortDescription:
      'A structured study plan and practice framework built around the licensing exams nursing candidates actually face, with real practice testing and one-on-one support.',
    primaryImage: { url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&h=800&fit=crop', publicId: 'seed_nursing-licensing-exam' },
    displayOrder: 2,
  },
  {
    title: 'International Student Counselling Program',
    shortDescription:
      'Guidance through university selection, applications, and visa preparation for students pursuing education abroad, from shortlisting to enrolment.',
    primaryImage: { url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop', publicId: 'seed_student-counselling' },
    displayOrder: 3,
  },
  {
    title: 'Credential Evaluation & Recognition Program',
    shortDescription:
      'We evaluate and translate your academic and professional credentials into a format recognized by institutions and employers overseas.',
    primaryImage: { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=800&fit=crop', publicId: 'seed_credential-evaluation-program' },
    displayOrder: 4,
  },
  {
    title: 'Global Relocation & Settlement Program',
    shortDescription:
      'End-to-end support for relocating abroad — visa processing, travel logistics, housing, and settling into your new role and community.',
    primaryImage: { url: 'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=1200&h=800&fit=crop', publicId: 'seed_relocation-settlement' },
    displayOrder: 5,
  },
];

const seedPopularPrograms = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(env.MONGO_URI);

    const admin = await User.findOne({ email: 'admin@hirelinks.com' });
    if (!admin) {
      console.error('❌ No admin user found — run the admin seed script first (tsx src/scripts/seed.ts).');
      process.exit(1);
    }

    let created = 0;
    for (const program of DUMMY_PROGRAMS) {
      const slug = slugify(program.title, { lower: true, strict: true });
      const existing = await Program.findOne({ slug });
      if (existing) {
        console.log(`Skipping "${program.title}" — already exists.`);
        continue;
      }

      await Program.create({
        ...program,
        slug,
        publishStatus: 'PUBLISHED',
        status: 'ACTIVE',
        isFeatured: false,
        steps: [],
        benefits: {},
        benefitItems: [],
        createdBy: admin._id,
        updatedBy: admin._id,
      });
      created++;
      console.log(`✅ Seeded "${program.title}"`);
    }

    console.log(`\nDone. ${created} program(s) created, ${DUMMY_PROGRAMS.length - created} skipped.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding popular programs:', error);
    process.exit(1);
  }
};

seedPopularPrograms();