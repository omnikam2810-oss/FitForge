import { Request, Response, NextFunction } from 'express';
import { Subscription } from '../models/Subscription';
import { error } from '../utils/apiResponse';

export const premiumMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return error(res, 'Premium subscription required', 403);
  }

  const subscription = await Subscription.findOne({ userId: req.user._id });
  const hasActiveSubscription =
    req.user.subscriptionTier === 'premium' &&
    subscription?.tier === 'premium' &&
    ['active', 'trialing'].includes(subscription.status) &&
    (!subscription.currentPeriodEnd || subscription.currentPeriodEnd > new Date());

  if (!hasActiveSubscription) {
    return error(res, 'Premium subscription required', 403);
  }

  next();
};
