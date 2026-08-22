import mongoose from 'mongoose';
import { User } from '../modules/users/user.model';
import { env } from '../config/env';

// Usage: tsx src/scripts/reset-admin-password.ts <email> <newPassword>
const [, , email, newPassword] = process.argv;

const resetAdminPassword = async () => {
  if (!email || !newPassword) {
    console.error('Usage: tsx src/scripts/reset-admin-password.ts <email> <newPassword>');
    process.exit(1);
  }

  try {
    console.log('Connecting to database...');
    await mongoose.connect(env.MONGO_URI);

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ No user found with email ${email}`);
      process.exit(1);
    }

    // Set + save (not updateOne) so the pre-save hook re-hashes the password.
    user.password = newPassword;
    await user.save();

    console.log(`✅ Password updated for ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    process.exit(1);
  }
};

resetAdminPassword();
