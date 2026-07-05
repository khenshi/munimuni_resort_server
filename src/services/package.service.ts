import prisma from '../database/prisma.js';
import { AppError } from '../common/AppError.js';
import type { CreatePackageInput } from '../validations/package.validation.js';

// Add the type parameter to your function signature
export const getAllPackages = async (bookingType?: 'DAY_TOUR' | 'OVERNIGHT', includeInactive = false) => {
  return await prisma.package.findMany({
    where: {
      // If includeInactive is false, only get active ones
      ...(includeInactive ? {} : { isActive: true }),
      // If 'bookingType' exists, add it to the search criteria
      ...(bookingType ? { bookingType: bookingType } : {}), 
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPackageById = async (id: number) => {
  const pkg = await prisma.package.findUnique({
    where: { id },
  });

  if (!pkg) {
    throw new AppError(`Package with ID ${id} not found`, 404);
  }

  return pkg;
};

// export const createPackage = async (data: CreatePackageInput) => {
//   return await prisma.package.create({
//     data,
//   });
// };

// // We will use Partial<CreatePackageInput> so we can update just one field (like price)
// export const updatePackage = async (id: number, data: Partial<CreatePackageInput>) => {
//   // First, check if it exists using our own function!
//   await getPackageById(id); 

//   return await prisma.package.update({
//     where: { id },
//     data,
//   });
// };

export const deletePackage = async (id: number) => {
  await getPackageById(id);

  return await prisma.package.delete({
    where: { id },
  });
};