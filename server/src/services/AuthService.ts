import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthPayload } from '../types';

export class AuthService {
  async login(email: string, password: string) {
    const user = await User.findOne({ email, status: 'Active' });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const payload: AuthPayload = {
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRATION || '24h',
    });

    return { token, user: { _id: user._id, email: user.email, name: user.name, role: user.role } };
  }

  async createUser(email: string, name: string, password: string, role: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, name, passwordHash, role, status: 'Active' });
    await user.save();

    return { _id: user._id, email: user.email, name: user.name, role: user.role };
  }

  async validateToken(token: string): Promise<AuthPayload | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthPayload;
      return decoded;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
