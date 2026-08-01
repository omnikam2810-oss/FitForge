import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { Workout } from '../models/Workout';
import { Exercise } from '../models/Exercise';
import { User } from '../models/User';
import { success, error } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

const enrichWorkout = async (payload: any) => {
  const exerciseIds = (payload.exercises ?? []).map((item: any) => item.exerciseId);
  const exercises = await Exercise.find({ _id: { $in: exerciseIds } });
  const exerciseById = new Map(exercises.map((exercise) => [exercise._id.toString(), exercise]));

  let totalVolume = 0;
  let totalSets = 0;
  const muscleGroups = new Set<string>();

  for (const workoutExercise of payload.exercises ?? []) {
    const exercise = exerciseById.get(String(workoutExercise.exerciseId));
    exercise?.primaryMuscles?.forEach((muscle) => muscleGroups.add(muscle));

    for (const set of workoutExercise.sets ?? []) {
      if (!set.completed) continue;
      totalSets += 1;
      totalVolume += (set.weight ?? 0) * (set.reps ?? 0);
    }
  }

  return { ...payload, totalVolume, totalSets, muscleGroups: Array.from(muscleGroups) };
};

router.get('/', async (req, res, next) => {
  try {
    const workouts = await Workout.find({ userId: req.user?._id }).sort({ startedAt: -1 }).populate('exercises.exerciseId');
    return success(res, workouts);
  } catch (err) {
    next(err);
  }
});

router.get('/repeat-last', async (req, res, next) => {
  try {
    const lastWorkout = await Workout.findOne({ userId: req.user?._id, completedAt: { $exists: true } })
      .sort({ completedAt: -1 })
      .populate('exercises.exerciseId');
    if (!lastWorkout) return error(res, 'No completed workout found', 404);
    return success(res, lastWorkout);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, userId: req.user?._id }).populate('exercises.exerciseId');
    if (!workout) return error(res, 'Workout not found', 404);
    return success(res, workout);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const workout = await Workout.create(await enrichWorkout({ ...req.body, userId: req.user?._id }));
    if (workout.completedAt) await User.findByIdAndUpdate(req.user?._id, { $inc: { totalWorkouts: 1 } });
    return success(res, workout, 'Created workout', 201);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const existing = await Workout.findOne({ _id: req.params.id, userId: req.user?._id });
    if (!existing) return error(res, 'Workout not found', 404);
    const mergedWorkout = {
      ...existing.toObject(),
      ...req.body,
      userId: req.user?._id,
      exercises: req.body.exercises ?? existing.exercises,
    };
    const workout = await Workout.findByIdAndUpdate(req.params.id, await enrichWorkout(mergedWorkout), { new: true });
    return success(res, workout, 'Updated workout');
  } catch (err) {
    next(err);
  }
});

export default router;
