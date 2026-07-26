import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => success(res, []));
router.get('/:id', (req, res) => success(res, {}));
router.post('/', (req, res) => success(res, {}, 'Created exercise', 201));

export default router;
