import mongoose from 'mongoose';
import slugify from 'slugify';
import { User } from '../modules/users/user.model';
import { Service } from '../modules/services/service.model';
import { env } from '../config/env';

// Dummy data for local/dev seeding — publicId is prefixed "seed_" (like the
// "local_"/"dummy_" convention CloudinaryService already recognizes) so a
// future delete never attempts to hit Cloudinary or the local uploads dir
// for these placeholder photos.
const DUMMY_SERVICES = [
  {
    title: 'Placement Support',
    shortDescription:
      'We will help you grow your business bigger by giving you the right business advice and ensure all your compliances are met.',
    primaryImage: { url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=800&fit=crop', publicId: 'seed_placement-support' },
    displayOrder: 1,
  },
  {
    title: 'Documentation Support & Data Flow',
    shortDescription:
      'S&P will help you decide which would be the best and simplest tax structure, be it a sole trader or company based on your requirements.',
    primaryImage: { url: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&h=800&fit=crop', publicId: 'seed_documentation-support' },
    displayOrder: 2,
  },
  {
    title: 'Global Nursing Licensing Exam Preparation',
    shortDescription:
      'We help small business owners follow financial rules and regulations, explain financial statements, oversee payment processes and help them file their taxes correctly.',
    primaryImage: { url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&h=800&fit=crop', publicId: 'seed_nursing-exam-prep' },
    displayOrder: 3,
  },
  {
    title: 'Credential Evaluation Assistance',
    shortDescription:
      'We guide you through every step of getting your academic and professional credentials evaluated and recognized internationally.',
    primaryImage: { url: 'https://images.unsplash.com/photo-1571772805064-207c8435df79?w=1200&h=800&fit=crop', publicId: 'seed_credential-evaluation' },
    displayOrder: 4,
  },
  {
    title: 'Visa & Relocation Guidance',
    shortDescription:
      'From paperwork to travel logistics, our team supports you at every stage of your visa application and relocation journey.',
    primaryImage: { url: 'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=1200&h=800&fit=crop', publicId: 'seed_visa-relocation' },
    displayOrder: 5,
  },
];

const seedPopularServices = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(env.MONGO_URI);

    const admin = await User.findOne({ email: 'admin@hirelinks.com' });
    if (!admin) {
      console.error('❌ No admin user found — run the admin seed script first (tsx src/scripts/seed.ts).');
      process.exit(1);
    }

    let created = 0;
    for (const service of DUMMY_SERVICES) {
      const slug = slugify(service.title, { lower: true, strict: true });
      const existing = await Service.findOne({ slug });
      if (existing) {
        console.log(`Skipping "${service.title}" — already exists.`);
        continue;
      }

      await Service.create({
        ...service,
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
      console.log(`✅ Seeded "${service.title}"`);
    }

    console.log(`\nDone. ${created} service(s) created, ${DUMMY_SERVICES.length - created} skipped.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding popular services:', error);
    process.exit(1);
  }
};

seedPopularServices();
