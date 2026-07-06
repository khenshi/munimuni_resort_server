import { z } from 'zod';

/*
    Validation schemas for package-related operations.
    This includes schemas for creating, updating, and fetching packages.
    Each schema defines the expected structure and constraints for incoming request data,
    ensuring that only valid data is processed by the application.
*/

// Create Schema 
export const createPackageSchema = z.object({
  body: z.object({
    name: z.string({ error: 'Package name is required' })
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    description: z.string().optional(),
    price: z.number({ error: 'Price is required' })
      .positive('Price must be greater than 0'),
    isActive: z.boolean().default(true),
  }).strict(),
});

// Get/Delete Schema (Validates the URL Parameter)
export const getPackageSchema = z.object({
  params: z.object({
    // z.coerce automatically converts the string URL parameter to a number!
    id: z.coerce.number({ error: 'Package ID must be a valid number' }),
  }),
});

// Update Schema (Combines params and an optional body)
export const updatePackageSchema = z.object({
  // Re-use the ID validation from above
  params: getPackageSchema.shape.params,
  // .partial() makes every field inside the body optional for PATCH requests
  body: createPackageSchema.shape.body.partial(), 
});


// The Query Schema for filtering
export const getAllPackagesSchema = z.object({
    query: z.object({
        // We make it optional so `GET /packages` still returns everything
        bookingType: z.enum(['DAY_TOUR', 'OVERNIGHT'], { 
            error: 'Booking type must be either DAY_TOUR or OVERNIGHT' 
        }).optional(),
    }),
});

// Export the strictly-inferred TypeScript Types for your Controllers
export type CreatePackageInput = z.infer<typeof createPackageSchema>['body'];
export type GetPackageParams = z.infer<typeof getPackageSchema>['params'];
export type GetAllPackagesQuery = z.infer<typeof getAllPackagesSchema>['query'];