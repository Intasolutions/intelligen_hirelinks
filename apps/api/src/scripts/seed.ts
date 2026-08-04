import mongoose from 'mongoose';
import { User } from '../modules/users/user.model';
import { env } from '../config/env';

const seedAdmin = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(env.MONGO_URI);
    
    const adminEmail = 'admin@hirelinks.com';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin user ${adminEmail} already exists.`);
      process.exit(0);
    }

    const admin = new User({
      email: adminEmail,
      password: 'password123', // Will be hashed automatically by the pre-save hook
      status: 'Active'
    });

    await admin.save();
    console.log(`✅ Admin user seeded successfully!`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: password123`);
    console.log(`⚠️ Please change this password in production!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
