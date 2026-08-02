import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { Follow } from '../models/Follow';
import { Workout } from '../models/Workout';
import { success, error } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.post('/follow/:userId', async (req, res, next) => {
  try {
    const following = req.params.userId;
    const follower = req.user?._id;
    if (!follower) return error(res, 'Unauthorized', 401);
    if (follower.toString() === following) return error(res, 'Cannot follow yourself', 400);

    const follow = await Follow.create({ follower, following });
    return success(res, follow, 'Followed user', 201);
  } catch (err: any) {
    if (err.code === 11000) return error(res, 'Already following', 400);
    next(err);
  }
});

router.delete('/unfollow/:userId', async (req, res, next) => {
  try {
    const following = req.params.userId;
    const follower = req.user?._id;
    await Follow.deleteOne({ follower, following });
    return success(res, null, 'Unfollowed user');
  } catch (err) {
    next(err);
  }
});

router.get('/followers', async (req, res, next) => {
  try {
    const followers = await Follow.find({ following: req.user?._id }).populate('follower', 'firstName lastName avatarUrl');
    return success(res, followers);
  } catch (err) {
    next(err);
  }
});

router.get('/following', async (req, res, next) => {
  try {
    const following = await Follow.find({ follower: req.user?._id }).populate('following', 'firstName lastName avatarUrl');
    return success(res, following);
  } catch (err) {
    next(err);
  }
});

router.get('/feed', async (req, res, next) => {
  try {
    const following = await Follow.find({ follower: req.user?._id }).select('following');
    const followingIds = following.map((f) => f.following);

    const workouts = await Workout.find({ userId: { $in: followingIds }, completedAt: { $exists: true } })
      .sort({ completedAt: -1 })
      .limit(20)
      .populate('userId', 'firstName lastName avatarUrl');

    return success(res, workouts);
  } catch (err) {
    next(err);
  }
});

export default router;
