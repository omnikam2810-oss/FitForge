import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { premiumMiddleware } from '../middleware/premium.middleware';
import { Program } from '../models/Program';
import { success, error } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const { difficulty, type, equipment } = req.query;
    const filter: any = {};
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;
    if (equipment) filter.requiredEquipment = { $all: String(equipment).split(',').map((item) => item.trim()) };

    const programs = await Program.find(filter).sort({ difficulty: 1, subscriberCount: -1 });
    return success(res, programs);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id).populate('weeks.days.exercises.exerciseId');
    if (!program) return error(res, 'Program not found', 404);
    if (program.isPremium) {
      return premiumMiddleware(req, res, () => success(res, program));
    }
    return success(res, program);
  } catch (err) {
    next(err);
  }
});

const enroll = async (req: any, res: any, next: any) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return error(res, 'Program not found', 404);

    const complete = program.weeks.length === program.durationWeeks && program.weeks.every((week) => {
      const trainingDays = week.days.filter((day) => !day.isRestDay);
      return trainingDays.length <= program.daysPerWeek && trainingDays.every((day) => day.exercises.length > 0);
    });
    if (!complete) return error(res, 'Program is not fully structured', 422);

    if (program.isPremium) {
      return premiumMiddleware(req, res, async () => {
        req.user.currentProgramId = program._id;
        await req.user.save();
        await Program.findByIdAndUpdate(program._id, { $inc: { subscriberCount: 1 } });
        return success(res, program, 'Subscribed to program');
      });
    }

    req.user.currentProgramId = program._id;
    await req.user.save();
    await Program.findByIdAndUpdate(program._id, { $inc: { subscriberCount: 1 } });
    return success(res, program, 'Subscribed to program');
  } catch (err) {
    next(err);
  }
};

router.post('/:id/subscribe', enroll);
router.post('/:id/enroll', enroll);

export default router;
