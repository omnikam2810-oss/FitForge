import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { premiumMiddleware } from '../middleware/premium.middleware';
import { Challenge } from '../models/Challenge';
import { Workout } from '../models/Workout';
import { success } from '../utils/apiResponse';
import { ensureDefaultChallenges } from '../utils/defaultData';

const router = Router();
router.use(authMiddleware);

router.get('/feed', async (req, res, next) => {
  try {
    const recentWorkouts = await Workout.find({ completedAt: { $exists: true } })
      .sort({ completedAt: -1 })
      .limit(10)
      .populate('userId', 'displayName avatarUrl');

    const feed = recentWorkouts.map((workout) => ({
      id: workout._id,
      userId: workout.userId,
      userName: (workout.userId as any)?.displayName ?? 'FitForge athlete',
      content: `Completed ${workout.name ?? 'a workout'} with ${workout.totalSets ?? 0} sets and ${workout.totalVolume ?? 0} kg volume.`,
      likes: Math.max(3, Math.round((workout.totalSets ?? 1) * 1.7)),
      comments: Math.max(0, Math.round((workout.overallRPE ?? 5) / 3)),
      createdAt: workout.completedAt ?? workout.startedAt,
    }));

    return success(res, feed);
  } catch (err) {
    next(err);
  }
});

router.post('/posts', (req, res) => success(res, {
  id: new Date().getTime().toString(),
  userId: req.user?._id,
  userName: req.user?.displayName,
  content: req.body.content,
  likes: 0,
  comments: 0,
  createdAt: new Date(),
}, 'Post created', 201));

router.post('/posts/:id/like', (req, res) => success(res, { id: req.params.id }, 'Post liked'));

router.get('/challenges', async (req, res, next) => {
  try {
    await ensureDefaultChallenges();
    const challenges = await Challenge.find({ isActive: true }).sort({ endDate: 1 });
    return success(res, challenges);
  } catch (err) {
    next(err);
  }
});

router.post('/challenges/:id/join', async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return success(res, null, 'Challenge not found', 404);
    if (challenge.isPremium) {
      return premiumMiddleware(req, res, async () => {
        if (!challenge.participants.some((participant) => participant.userId.toString() === req.user?._id.toString())) {
          challenge.participants.push({ userId: req.user?._id as any, progress: 0, joinedAt: new Date() });
          await challenge.save();
        }
        return success(res, challenge, 'Joined challenge');
      });
    }
    if (!challenge.participants.some((participant) => participant.userId.toString() === req.user?._id.toString())) {
      challenge.participants.push({ userId: req.user?._id as any, progress: 0, joinedAt: new Date() });
      await challenge.save();
    }
    return success(res, challenge, 'Joined challenge');
  } catch (err) {
    next(err);
  }
});

export default router;
