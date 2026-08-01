import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { stripe } from '../config/stripe';
import { env } from '../config/env';
import { Subscription } from '../models/Subscription';
import { User } from '../models/User';
import { success, error } from '../utils/apiResponse';

const router = Router();

const activeStatuses = ['active', 'trialing'];

router.post('/webhook', async (req, res, next) => {
  try {
    const event = req.body;
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const stripeSubscription = event.data.object;
      const subscription = await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: stripeSubscription.id },
        {
          status: stripeSubscription.status,
          tier: activeStatuses.includes(stripeSubscription.status) ? 'premium' : 'free',
          currentPeriodStart: stripeSubscription.current_period_start ? new Date(stripeSubscription.current_period_start * 1000) : undefined,
          currentPeriodEnd: stripeSubscription.current_period_end ? new Date(stripeSubscription.current_period_end * 1000) : undefined,
          cancelAtPeriodEnd: Boolean(stripeSubscription.cancel_at_period_end),
          canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : undefined,
        },
        { new: true }
      );

      if (subscription) {
        await User.findByIdAndUpdate(subscription.userId, { subscriptionTier: subscription.tier });
      }
    }
    return success(res, null, 'Webhook received');
  } catch (err) {
    next(err);
  }
});

router.use(authMiddleware);

router.post(['/create-checkout', '/create-checkout-session'], async (req, res, next) => {
  try {
    const { priceId, trialDays = 7 } = req.body;
    if (!priceId) return error(res, 'priceId is required', 400);

    let customerId = req.user?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user?.email,
        name: req.user?.displayName,
        metadata: { userId: req.user?._id.toString() ?? '' },
      });
      customerId = customer.id;
      if (req.user) {
        req.user.stripeCustomerId = customerId;
        await req.user.save();
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: trialDays },
      success_url: `${env.CLIENT_URL}/subscription/success`,
      cancel_url: `${env.CLIENT_URL}/subscription/cancel`,
    });

    return success(res, { url: session.url });
  } catch (err) {
    next(err);
  }
});

router.get('/status', async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user?._id });
    return success(res, subscription ?? { tier: 'free', status: 'inactive' });
  } catch (err) {
    next(err);
  }
});

router.post('/cancel', async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user?._id });
    if (!subscription?.stripeSubscriptionId) return error(res, 'No Stripe subscription found', 404);

    const stripeSubscription = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    subscription.cancelAtPeriodEnd = true;
    subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    await subscription.save();
    return success(res, subscription, 'Subscription cancellation scheduled');
  } catch (err) {
    next(err);
  }
});

router.post('/restore', async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user?._id });
    if (!subscription?.stripeSubscriptionId) return error(res, 'No Stripe subscription found', 404);

    const stripeSubscription = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    subscription.status = stripeSubscription.status as any;
    subscription.tier = activeStatuses.includes(stripeSubscription.status) ? 'premium' : 'free';
    subscription.cancelAtPeriodEnd = false;
    await subscription.save();
    await User.findByIdAndUpdate(req.user?._id, { subscriptionTier: subscription.tier });
    return success(res, subscription, 'Subscription restored');
  } catch (err) {
    next(err);
  }
});

router.post('/change-plan', async (req, res, next) => {
  try {
    const { priceId } = req.body;
    if (!priceId) return error(res, 'priceId is required', 400);

    const subscription = await Subscription.findOne({ userId: req.user?._id });
    if (!subscription?.stripeSubscriptionId) return error(res, 'No Stripe subscription found', 404);

    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
    const itemId = stripeSubscription.items.data[0]?.id;
    if (!itemId) return error(res, 'Subscription has no item to update', 422);

    const updated = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [{ id: itemId, price: priceId }],
      proration_behavior: 'create_prorations',
    });

    subscription.stripePriceId = priceId;
    subscription.status = updated.status as any;
    subscription.tier = activeStatuses.includes(updated.status) ? 'premium' : 'free';
    await subscription.save();
    await User.findByIdAndUpdate(req.user?._id, { subscriptionTier: subscription.tier });
    return success(res, subscription, 'Subscription updated');
  } catch (err) {
    next(err);
  }
});

export default router;
