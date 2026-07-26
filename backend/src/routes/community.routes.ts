import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { premiumMiddleware } from '../middleware/premium.middleware';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.get('/feed', (req, res) => success(res, []));
router.get('/challenges', (req, res) => success(res, []));
router.post('/challenges/:id/join', premiumMiddleware, (req, res) => success(res, {}, 'Joined challenge'));

export default router;
