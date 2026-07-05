import { z } from 'zod';

// 1. The Create Schema (You already have this)
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

// 2. The Get/Delete Schema (Validates the URL Parameter)
export const getPackageSchema = z.object({
  params: z.object({
    // z.coerce automatically converts the string URL parameter to a number!
    id: z.coerce.number({ error: 'Package ID must be a valid number' }),
  }),
});

// 3. The Update Schema (Combines params and an optional body)
export const updatePackageSchema = z.object({
  // Re-use the ID validation from above
  params: getPackageSchema.shape.params,
  // .partial() makes every field inside the body optional for PATCH requests
  body: createPackageSchema.shape.body.partial(), 
});

// 4. Export the strictly-inferred TypeScript Types for your Controllers
export type CreatePackageInput = z.infer<typeof createPackageSchema>['body'];
export type GetPackageParams = z.infer<typeof getPackageSchema>['params'];
// (Optional: You can export UpdatePackageInput if you want, but Partial<CreatePackageInput> in the controller works perfectly too)

// 1. The Query Schema for filtering
export const getAllPackagesSchema = z.object({
  query: z.object({
    // We make it optional so `GET /packages` still returns everything
    bookingType: z.enum(['DAY_TOUR', 'OVERNIGHT'], { 
      error: 'Booking type must be either DAY_TOUR or OVERNIGHT' 
    }).optional(),
  }),
});

// 2. Export the inferred type for the Controller
export type GetAllPackagesQuery = z.infer<typeof getAllPackagesSchema>['query'];