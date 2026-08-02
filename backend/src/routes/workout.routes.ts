import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { Workout } from '../models/Workout';
import { Exercise } from '../models/Exercise';
import { User } from '../models/User';
import { success, error } from '../utils/apiResponse';
import { validate } from '../middleware/validator';
import { createWorkoutSchema, updateWorkoutSchema } from '../validations';

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

router.get('/analytics/summary', async (req, res, next) => {
  try {
    const workouts = await Workout.find({ userId: req.user?._id }).sort({ startedAt: 1 });
    const completed = workouts.filter((workout) => workout.completedAt);
    const totalVolume = completed.reduce((sum, workout) => sum + (workout.totalVolume ?? 0), 0);
    const totalSets = completed.reduce((sum, workout) => sum + (workout.totalSets ?? 0), 0);

    const volumeByWeek = new Map<string, number>();
    const muscleBalance = new Map<string, number>();
    let bestEstimatedOneRepMax = 0;

    for (const workout of completed) {
      const date = workout.completedAt ?? workout.startedAt;
      const weekKey = `${date.getFullYear()}-W${Math.ceil((((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000) + new Date(date.getFullYear(), 0, 1).getDay() + 1) / 7)}`;
      volumeByWeek.set(weekKey, (volumeByWeek.get(weekKey) ?? 0) + (workout.totalVolume ?? 0));
      workout.muscleGroups?.forEach((muscle) => muscleBalance.set(muscle, (muscleBalance.get(muscle) ?? 0) + 1));

      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          if (set.completed && set.weight && set.reps) {
            bestEstimatedOneRepMax = Math.max(bestEstimatedOneRepMax, set.weight * (1 + set.reps / 30));
          }
        });
      });
    }

    return success(res, {
      totalWorkouts: completed.length,
      totalVolume,
      totalSets,
      averageVolume: completed.length ? Math.round(totalVolume / completed.length) : 0,
      bestEstimatedOneRepMax: Math.round(bestEstimatedOneRepMax * 10) / 10,
      volumeByWeek: Array.from(volumeByWeek, ([week, volume]) => ({ week, volume })),
      muscleBalance: Array.from(muscleBalance, ([muscle, sessions]) => ({ muscle, sessions })),
    });
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

router.post('/', validate(createWorkoutSchema), async (req, res, next) => {
  try {
    const workout = await Workout.create(await enrichWorkout({ ...req.body, userId: req.user?._id }));
    if (workout.completedAt) await User.findByIdAndUpdate(req.user?._id, { $inc: { totalWorkouts: 1 } });
    
    // PR Detection
    const personalRecords = [];
    if (workout.completedAt) {
      for (const we of workout.exercises) {
        let bestNewWeight = 0;
        let bestNewReps = 0;
        for (const set of we.sets) {
          if (set.completed && set.weight && set.reps) {
            if (set.weight > bestNewWeight || (set.weight === bestNewWeight && set.reps > bestNewReps)) {
              bestNewWeight = set.weight;
              bestNewReps = set.reps;
            }
          }
        }
        
        if (bestNewWeight > 0) {
          const previousWorkouts = await Workout.find({
            userId: req.user?._id,
            completedAt: { $exists: true, $lt: workout.completedAt },
            'exercises.exerciseId': we.exerciseId
          });
          
          let previousBestWeight = 0;
          let previousBestReps = 0;
          
          for (const prevW of previousWorkouts) {
            for (const pwe of prevW.exercises) {
              if (pwe.exerciseId.toString() === we.exerciseId.toString()) {
                for (const pset of pwe.sets) {
                  if (pset.completed && pset.weight && pset.reps) {
                    if (pset.weight > previousBestWeight || (pset.weight === previousBestWeight && pset.reps > previousBestReps)) {
                      previousBestWeight = pset.weight;
                      previousBestReps = pset.reps;
                    }
                  }
                }
              }
            }
          }
          
          if (bestNewWeight > previousBestWeight) {
            const exercise = await Exercise.findById(we.exerciseId);
            personalRecords.push({
              exerciseId: we.exerciseId,
              exerciseName: exercise?.name || 'Unknown',
              previousBest: `${previousBestWeight}x${previousBestReps}`,
              newRecord: `${bestNewWeight}x${bestNewReps}`
            });
          }
        }
      }
    }
    
    return success(res, { ...workout.toObject(), personalRecords }, 'Created workout', 201);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validate(updateWorkoutSchema), async (req, res, next) => {
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

router.get('/analytics/exercise/:exerciseId', async (req, res, next) => {
  try {
    const workouts = await Workout.find({
      userId: req.user?._id,
      completedAt: { $exists: true },
      'exercises.exerciseId': req.params.exerciseId
    }).sort({ completedAt: 1 });
    
    const result = workouts.map(w => {
      const we = w.exercises.find(e => e.exerciseId.toString() === req.params.exerciseId);
      const sets = we?.sets.filter(s => s.completed && s.weight && s.reps).map(s => ({
        weight: s.weight,
        reps: s.reps,
        estimated1RM: (s.weight as number) * (1 + (s.reps as number) / 30)
      })) || [];
      return { date: w.completedAt, sets };
    }).filter(r => r.sets.length > 0);
    
    return success(res, result);
  } catch (err) {
    next(err);
  }
});

router.get('/analytics/prs', async (req, res, next) => {
  try {
    const workouts = await Workout.find({ userId: req.user?._id, completedAt: { $exists: true } });
    const bests = new Map<string, { weight: number, reps: number, date: Date, name: string }>();
    
    for (const w of workouts) {
      for (const we of w.exercises) {
        for (const s of we.sets) {
          if (s.completed && s.weight && s.reps) {
            const exId = we.exerciseId.toString();
            const current = bests.get(exId);
            if (!current || s.weight > current.weight || (s.weight === current.weight && s.reps > current.reps)) {
              bests.set(exId, { weight: s.weight, reps: s.reps, date: w.completedAt as Date, name: 'Exercise' });
            }
          }
        }
      }
    }
    
    // We would fetch exercise names here for a real impl
    const prs = Array.from(bests.entries()).map(([exerciseId, data]) => ({
      exerciseId,
      ...data
    }));
    
    return success(res, prs);
  } catch (err) {
    next(err);
  }
});

router.get('/analytics/streaks', async (req, res, next) => {
  try {
    const workouts = await Workout.find({ userId: req.user?._id, completedAt: { $exists: true } })
      .sort({ completedAt: -1 });
    
    if (!workouts.length) return success(res, { currentStreak: 0, longestStreak: 0 });
    
    const dates = workouts.map(w => {
      const d = new Date(w.completedAt as Date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });
    
    const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const msPerDay = 86400000;
    
    if (uniqueDates[0] === today.getTime() || uniqueDates[0] === today.getTime() - msPerDay) {
      currentStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        if (uniqueDates[i-1] - uniqueDates[i] === msPerDay) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    for (let i = 1; i < uniqueDates.length; i++) {
      if (uniqueDates[i-1] - uniqueDates[i] === msPerDay) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
    
    return success(res, { currentStreak, longestStreak });
  } catch (err) {
    next(err);
  }
});

export default router;
