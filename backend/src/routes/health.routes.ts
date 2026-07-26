import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.post('/sync', (req, res) => success(res, {}, 'Health data synced'));

export default router;
