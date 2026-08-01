import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { premiumMiddleware } from '../middleware/premium.middleware';
import { Exercise } from '../models/Exercise';
import { success, error } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const { q, category, difficulty, equipment, muscle, premium } = req.query;
    const filter: any = {};

    if (q) filter.$text = { $search: String(q) };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (equipment) filter.equipment = { $all: String(equipment).split(',').map((item) => item.trim()) };
    if (muscle) filter.primaryMuscles = { $in: String(muscle).split(',').map((item) => item.trim()) };
    if (premium !== 'true') filter.isPremium = false;

    const exercises = await Exercise.find(filter).sort({ name: 1 });
    return success(res, exercises);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return error(res, 'Exercise not found', 404);
    if (exercise.isPremium) {
      return premiumMiddleware(req, res, () => success(res, exercise));
    }
    return success(res, exercise);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const exercise = await Exercise.create({ ...req.body, isCustom: true, createdBy: req.user?._id });
    return success(res, exercise, 'Created exercise', 201);
  } catch (err) {
    next(err);
  }
});

export default router;
