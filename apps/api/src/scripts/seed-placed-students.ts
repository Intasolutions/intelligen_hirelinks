import mongoose from 'mongoose';
import { User } from '../modules/users/user.model';
import { PlacedStudent } from '../modules/placed-students/placed-student.model';
import { env } from '../config/env';

// Dummy data for local/dev seeding — publicId is prefixed "seed_" (like the
// "local_"/"dummy_" convention CloudinaryService already recognizes) so a
// future delete never attempts to hit Cloudinary or the local uploads dir
// for these placeholder photos.
const DUMMY_STUDENTS = [
  {
    name: 'Catherine Meg',
    program: 'Nursing',
    country: 'USA',
    countryCode: 'us',
    photo: { url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop', publicId: 'seed_catherine-meg' },
    displayOrder: 1,
  },
  {
    name: 'James Carter',
    program: 'MBBS',
    country: 'Australia',
    countryCode: 'au',
    photo: { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop', publicId: 'seed_james-carter' },
    displayOrder: 2,
  },
  {
    name: 'Daniel Souza',
    program: 'MBA',
    country: 'Brazil',
    countryCode: 'br',
    photo: { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop', publicId: 'seed_daniel-souza' },
    displayOrder: 3,
  },
  {
    name: 'Priya Sharma',
    program: 'Nursing',
    country: 'India',
    countryCode: 'in',
    photo: { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop', publicId: 'seed_priya-sharma' },
    displayOrder: 4,
  },
  {
    name: 'Robert King',
    program: 'Engineering',
    country: 'United Kingdom',
    countryCode: 'gb',
    photo: { url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&h=800&fit=crop', publicId: 'seed_robert-king' },
    displayOrder: 5,
  },
  {
    name: 'Fatima Al-Sayed',
    program: 'Nursing',
    country: 'UAE',
    countryCode: 'ae',
    photo: { url: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=600&h=800&fit=crop', publicId: 'seed_fatima-al-sayed' },
    displayOrder: 6,
  },
  {
    name: 'Liam O’Connor',
    program: 'Hospitality Management',
    country: 'Canada',
    countryCode: 'ca',
    photo: { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&sat=-100', publicId: 'seed_liam-oconnor' },
    displayOrder: 7,
  },
  {
    name: 'Aiko Tanaka',
    program: 'MBA',
    country: 'Japan',
    countryCode: 'jp',
    photo: { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&sat=-50', publicId: 'seed_aiko-tanaka' },
    displayOrder: 8,
  },
  {
    name: 'Marco Rossi',
    program: 'Engineering',
    country: 'Italy',
    countryCode: 'it',
    photo: { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop&sat=-30', publicId: 'seed_marco-rossi' },
    displayOrder: 9,
  },
  {
    name: 'Grace Mensah',
    program: 'Nursing',
    country: 'Ghana',
    countryCode: 'gh',
    photo: { url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop&sat=-40', publicId: 'seed_grace-mensah' },
    displayOrder: 10,
  },
  {
    name: 'Sophie Dubois',
    program: 'Hospitality Management',
    country: 'France',
    countryCode: 'fr',
    photo: { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop', publicId: 'seed_sophie-dubois' },
    displayOrder: 11,
  },
  {
    name: 'Wei Zhang',
    program: 'Engineering',
    country: 'Singapore',
    countryCode: 'sg',
    photo: { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop', publicId: 'seed_wei-zhang' },
    displayOrder: 12,
  },
];

const seedPlacedStudents = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(env.MONGO_URI);

    const admin = await User.findOne({ email: 'admin@hirelinks.com' });
    if (!admin) {
      console.error('❌ No admin user found — run the admin seed script first (tsx src/scripts/seed.ts).');
      process.exit(1);
    }

    let created = 0;
    for (const student of DUMMY_STUDENTS) {
      const existing = await PlacedStudent.findOne({ name: student.name });
      if (existing) {
        console.log(`Skipping "${student.name}" — already exists.`);
        continue;
      }

      await PlacedStudent.create({
        ...student,
        status: 'ACTIVE',
        createdBy: admin._id,
        updatedBy: admin._id,
      });
      created++;
      console.log(`✅ Seeded "${student.name}"`);
    }

    console.log(`\nDone. ${created} placed student(s) created, ${DUMMY_STUDENTS.length - created} skipped.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding placed students:', error);
    process.exit(1);
  }
};

seedPlacedStudents();
