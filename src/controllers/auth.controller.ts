import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as authService from '../services/auth.service.js';
import type { RegisterUserInput } from '../validations/auth.validation.js';
import { AppError } from '../common/AppError.js';

/*
    Controller for handling user authentication-related requests.
    This includes user registration, login, and other auth-related endpoints.
    Each controller function is responsible for validating input, calling the appropriate service,
    and sending a standardized response back to the client.
*/

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = req.body as RegisterUserInput;

    //  let service handle the database logic
    const newUser = await authService.registerUser(validatedData);

    // grab the JWT Secret (satisfying strict TS mode)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError('JWT_SECRET is not defined in environment variables', 500);
    }

    // Generate the token (expires in 7 days)
    const token = jwt.sign({ id: newUser.id }, jwtSecret, {
      expiresIn: '7d',
    });

    // Send the token in an HttpOnly cookie
    res.cookie('jwt', token, {
      httpOnly: true, // 👈 JavaScript cannot access this cookie
      secure: process.env.NODE_ENV === 'production', // 👈 Only sent over HTTPS in prod
      sameSite: 'strict', // 👈 Protects against CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Send the success response (NO token in the JSON body)
    res.status(201).json({
      status: 'success',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};