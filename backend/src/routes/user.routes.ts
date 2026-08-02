import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

import { validate } from '../middleware/validator';
import { updateProfileSchema, onboardingSchema } from '../validations';

const router = Router();
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.put('/onboarding', validate(onboardingSchema), userController.onboarding);

export default router;
