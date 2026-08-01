import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { Measurement } from '../models/Measurement';
import { success, error } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const measurements = await Measurement.find({ userId: req.user?._id }).sort({ date: 1 });
    return success(res, measurements);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const measurement = await Measurement.create({ ...req.body, userId: req.user?._id, date: req.body.date ?? new Date() });
    return success(res, measurement, 'Created measurement', 201);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const measurement = await Measurement.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      req.body,
      { new: true }
    );
    if (!measurement) return error(res, 'Measurement not found', 404);
    return success(res, measurement, 'Updated measurement');
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const measurement = await Measurement.findOneAndDelete({ _id: req.params.id, userId: req.user?._id });
    if (!measurement) return error(res, 'Measurement not found', 404);
    return success(res, null, 'Deleted measurement');
  } catch (err) {
    next(err);
  }
});

export default router;
