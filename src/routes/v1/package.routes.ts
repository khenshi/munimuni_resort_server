import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { createPackageSchema, getPackageSchema} from '../../validations/package.validation.js';
import * as packageController from '../../controllers/package.controller.js';
import { getAllPackagesSchema } from '../../validations/package.validation.js';

/*
    Package Routes
    This file defines the routes for package-related operations in the application.
    It includes public routes for fetching packages and protected routes for creating, updating, and deleting packages.
    The routes are organized using Express Router, and validation middleware is applied to ensure that incoming requests meet the expected schema.
*/

const router = Router();

// Public routes (Anyone can see packages)
router.get('/', validate(getAllPackagesSchema), packageController.getAllPackages);
router.get('/:id', validate(getPackageSchema), packageController.getPackageById);

// Protected Admin routes (We will add Auth middleware here soon!)
// router.post('/', validate(createPackageSchema), packageController.createPackage);
// router.patch('/:id', validate(updatePackageSchema), packageController.updatePackage);
// router.delete('/:id', validate(getPackageSchema), packageController.deletePackage);

export default router;