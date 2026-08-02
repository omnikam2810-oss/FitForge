import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { Workout } from '../models/Workout';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.get('/csv', async (req, res, next) => {
  try {
    const workouts = await Workout.find({ userId: req.user?._id }).populate('exercises.exerciseId');
    
    let csv = 'Workout Name,Date,Exercise,Set,Weight,Reps\n';
    
    for (const w of workouts) {
      const date = (w.completedAt || w.startedAt).toISOString();
      for (const we of w.exercises) {
        const exName = (we.exerciseId as any)?.name || 'Unknown';
        for (const s of we.sets) {
          csv += `"${w.name || 'Workout'}","${date}","${exName}",${s.setNumber},${s.weight || 0},${s.reps || 0}\n`;
        }
      }
    }
    
    res.header('Content-Type', 'text/csv');
    res.attachment('workouts.csv');
    return res.send(csv);
  } catch (err) {
    next(err);
  }
});

router.get('/json', async (req, res, next) => {
  try {
    const workouts = await Workout.find({ userId: req.user?._id }).populate('exercises.exerciseId');
    return success(res, workouts);
  } catch (err) {
    next(err);
  }
});

export default router;
