import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { premiumMiddleware } from '../middleware/premium.middleware';
import { Challenge } from '../models/Challenge';
import { Workout } from '../models/Workout';
import { success, error } from '../utils/apiResponse';
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

import { Post } from '../models/Post';

router.post('/posts', async (req, res, next) => {
  try {
    const post = await Post.create({
      userId: req.user?._id,
      content: req.body.content
    });
    return success(res, post, 'Post created', 201);
  } catch (err) {
    next(err);
  }
});

router.post('/posts/:id/like', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return error(res, 'Post not found', 404);
    
    const userId = req.user?._id;
    const index = post.likes.indexOf(userId as any);
    
    if (index === -1) {
      post.likes.push(userId as any);
    } else {
      post.likes.splice(index, 1);
    }
    
    await post.save();
    return success(res, post, 'Post updated');
  } catch (err) {
    next(err);
  }
});

router.delete('/posts/:id', async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, userId: req.user?._id });
    if (!post) return error(res, 'Post not found or unauthorized', 404);
    return success(res, null, 'Post deleted');
  } catch (err) {
    next(err);
  }
});

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
