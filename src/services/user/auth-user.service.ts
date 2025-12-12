import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../../middleware';
import { type RegisterUserRequest, type UserResponse } from '../../models/user';
import { userRepository } from '../../repositories/user';

/**
 * User Service
 * Business logic layer untuk user management
 */
export const userService = {
  /**
   * Register user baru
   * - Validasi email belum terdaftar
   * - Hash password
   * - Create user di database
   * @param data Register request data
   * @returns User response
   */
  async registerUser(data: RegisterUserRequest): Promise<UserResponse> {
    // Check email already exists
    const emailExists = await userRepository.emailExists(data.email);

    if (emailExists) {
      throw new CustomError(StatusCodes.CONFLICT, 'Email sudah terdaftar');
    }

    // Hash password dengan bcryptjs (10 salt rounds)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user di database
    const user = await userRepository.createUser(data.email, hashedPassword, data.name);

    return user;
  },

  /**
   * Login user
   * - Validasi email terdaftar
   * - Validasi password cocok
   * - Return user info (tanpa password)
   * @param email User email
   * @param password User password (plain text)
   * @returns User response
   */
  async loginUser(email: string, password: string): Promise<UserResponse> {
    // Get user dengan password
    const user = await userRepository.getUserWithPassword(email);

    if (!user) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, 'Email atau password salah');
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, 'Email atau password salah');
    }

    // Return user response (tanpa password)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  },

  /**
   * Get user profile by ID
   * @param userId User ID
   * @returns User profile
   */
  async getUserProfile(userId: string) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    return user;
  },
};
