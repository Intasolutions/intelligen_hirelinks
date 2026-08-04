import bcrypt from 'bcryptjs';
import { User } from '../users/user.model';
import { LoginInput } from '@hirelinks/contracts';
import { UnauthorizedError } from '../../shared/errors';
import { generateToken } from '../../shared/jwt';

export class AuthService {
  static async login(payload: LoginInput) {
    const user = await User.findOne({ email: payload.email, isDeleted: false });
    
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.status !== 'Active') {
      throw new UnauthorizedError('Account is inactive');
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);
    
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken(user._id.toString());
    
    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        status: user.status
      }
    };
  }

  static async getMe(userId: string) {
    const user = await User.findById(userId).select('-password').lean();
    if (!user || user.isDeleted || user.status !== 'Active') {
      throw new UnauthorizedError('User not found or inactive');
    }
    return user;
  }
}
