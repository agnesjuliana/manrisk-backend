import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../../middleware';
import { type RegisterUserRequest, type UserResponse, type LoginUserResponse } from '../../models/user';
import { userRepository } from '../../repositories/user';
import { generateAccessToken } from '../../utils/JwtToken';

export const userService = {
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

  async loginUser(email: string, password: string): Promise<LoginUserResponse> {
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

    // Generate JWT token dengan payload: id, role, email
    const token = generateAccessToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    // Return user response + token
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
      expiresIn: 24 * 60 * 60, // 24 hours in seconds
    };
  },

  async getUserProfile(userId: string) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    return user;
  },
};
