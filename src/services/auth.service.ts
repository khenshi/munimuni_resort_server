import bcrypt from 'bcrypt';
import prisma  from '../database/prisma.js';
import { AppError } from '../common/AppError.js';
import type { RegisterUserInput } from '../validations/auth.validation.js'; 

/*
    Service layer for handling user authentication-related operations.
    This includes user registration, login, and other auth-related business logic.
    Each service function is responsible for interacting with the database and performing necessary operations,
    while ensuring that sensitive information (like passwords) is handled securely.
*/

// Service function to register a new user
export const registerUser = async (data: RegisterUserInput) => {
  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('Email is already in use', 409);
  }

  // Hash the password with a salt round of 12 (Industry standard)
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // Create the user
  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  // never return the password back to the controller
  const { password, ...userWithoutPassword } = newUser;
  
  return userWithoutPassword;
};