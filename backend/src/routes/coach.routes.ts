import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { premiumMiddleware } from '../middleware/premium.middleware';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware, premiumMiddleware);

router.get('/chat', (req, res) => success(res, []));
router.post('/chat/message', (req, res) => success(res, {}, 'Message sent', 201));

export default router;
