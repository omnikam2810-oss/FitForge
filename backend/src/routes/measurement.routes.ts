import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => success(res, []));
router.post('/', (req, res) => success(res, {}, 'Created measurement', 201));
router.put('/:id', (req, res) => success(res, {}, 'Updated measurement'));
router.delete('/:id', (req, res) => success(res, null, 'Deleted measurement'));

export default router;
