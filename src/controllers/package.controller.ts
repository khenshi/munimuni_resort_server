import type { Request, Response, NextFunction } from 'express';
import * as packageService from '../services/package.service.js';
import type { CreatePackageInput, GetPackageParams, GetAllPackagesQuery } from '../validations/package.validation.js';

/*
    Controller for handling package-related requests.
    This includes fetching all packages, fetching a package by ID, and other package-related endpoints.
    Each controller function is responsible for validating input, calling the appropriate service,
    and sending a standardized response back to the client.
*/

// function to get all packages, optionally filtered by bookingType
export const getAllPackages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Cast req.query safely using our new Zod type
    const query = req.query as GetAllPackagesQuery;
    
    // Pass the type to the service
    const packages = await packageService.getAllPackages(query.bookingType);
    
    res.status(200).json({ status: 'success', data: packages });
  } catch (error) {
    next(error);
  }
};

// Controller to get a package by its ID
export const getPackageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validated by Zod middleware
    const { id } = req.params as unknown as GetPackageParams;
    const pkg = await packageService.getPackageById(id);
    
    res.status(200).json({ status: 'success', data: pkg });
  } catch (error) {
    next(error);
  }
};

// export const createPackage = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const validatedData = req.body as CreatePackageInput;
//     const newPackage = await packageService.createPackage(validatedData);
    
//     res.status(201).json({ status: 'success', data: newPackage });
//   } catch (error) {
//     next(error);
//   }
// };

// export const updatePackage = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params as unknown as GetPackageParams;
//     const validatedData = req.body as Partial<CreatePackageInput>;
    
//     const updatedPackage = await packageService.updatePackage(id, validatedData);
//     res.status(200).json({ status: 'success', data: updatedPackage });
//   } catch (error) {
//     next(error);
//   }
// };

// export const deletePackage = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params as unknown as GetPackageParams;
//     await packageService.deletePackage(id);
    
//     res.status(204).send(); // 204 No Content for successful deletions
//   } catch (error) {
//     next(error);
//   }
// };