import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { premiumMiddleware } from '../middleware/premium.middleware';
import { CoachChat } from '../models/CoachChat';
import { User } from '../models/User';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.get('/coaches', async (req, res, next) => {
  try {
    let coaches = await User.find({ isCoach: true }).select('displayName avatarUrl coachId');
    if (!coaches.length) {
      coaches = [
        {
          _id: 'virtual-coach',
          displayName: 'Maya Singh',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        } as any,
      ];
    }
    return success(res, coaches.map((coach: any) => ({
      id: coach._id,
      name: coach.displayName,
      specialty: 'Strength programming',
      rating: 4.9,
      imageUrl: coach.avatarUrl,
    })));
  } catch (err) {
    next(err);
  }
});

router.get('/chat', premiumMiddleware, async (req, res, next) => {
  try {
    const chat = await CoachChat.findOne({ userId: req.user?._id, isActive: true }).sort({ lastMessageAt: -1 });
    return success(res, chat?.messages ?? []);
  } catch (err) {
    next(err);
  }
});

router.post('/chat/message', premiumMiddleware, async (req, res, next) => {
  try {
    let coach = await User.findOne({ isCoach: true });
    if (!coach) {
      coach = await User.create({ email: 'coach@fitforge.local', displayName: 'Maya Singh', authProvider: 'email', isCoach: true });
    }
    const message = { senderId: req.user?._id as any, content: req.body.content, sentAt: new Date() };
    const chat = await CoachChat.findOneAndUpdate(
      { userId: req.user?._id, coachId: coach._id },
      { $push: { messages: message }, lastMessageAt: new Date(), $inc: { unreadByCoach: 1 } },
      { upsert: true, new: true }
    );
    return success(res, chat, 'Message sent', 201);
  } catch (err) {
    next(err);
  }
});

router.post('/coaches/:id/book', premiumMiddleware, (req, res) => success(res, {
  coachId: req.params.id,
  date: req.body.date,
  status: 'requested',
}, 'Session requested', 201));

export default router;
