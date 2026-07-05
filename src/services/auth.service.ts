import bcrypt from 'bcrypt';
import prisma  from '../database/prisma.js';
import { AppError } from '../common/AppError.js';
// (Assuming you create a register schema in your validations folder!)
import type { RegisterUserInput } from '../validations/auth.validation.js'; 

export const registerUser = async (data: RegisterUserInput) => {
  // 1. Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('Email is already in use', 409);
  }

  // 2. Hash the password with a salt round of 12 (Industry standard)
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // 3. Create the user
  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  // 4. NEVER return the password back to the controller, even if it's hashed!
  const { password, ...userWithoutPassword } = newUser;
  
  return userWithoutPassword;
};