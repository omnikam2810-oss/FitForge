import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { success } from '../utils/apiResponse';

const router = Router();

router.post('/webhook', (req, res) => success(res, null, 'Webhook received'));

router.use(authMiddleware);
router.post('/create-checkout', (req, res) => success(res, { url: 'checkout_url' }));
router.get('/status', (req, res) => success(res, { status: 'active' }));

export default router;
