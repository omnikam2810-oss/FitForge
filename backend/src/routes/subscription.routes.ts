import { Router } from 'express';
import Stripe from 'stripe';
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
    const signature = req.headers['stripe-signature'] as string;
    if (!signature) return error(res, 'Missing Stripe signature', 400);

    const rawBody = (req as any).rawBody;
    if (!rawBody) return error(res, 'Raw body not available for webhook validation', 400);

    let event: any;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
    } catch (webhookError: any) {
      return error(res, `Webhook signature verification failed: ${webhookError.message}`, 400);
    }

    const handleSubscriptionEvent = async (stripeSubscription: any) => {
      const stripeCustomerId = stripeSubscription.customer;
      const stripePriceId = stripeSubscription.items?.data?.[0]?.price?.id;
      const tier = activeStatuses.includes(stripeSubscription.status) ? 'premium' : 'free';

      let subscription = await Subscription.findOne({ stripeSubscriptionId: stripeSubscription.id });
      if (!subscription && stripeCustomerId) {
        subscription = await Subscription.findOne({ stripeCustomerId });
      }

      if (subscription) {
        subscription.stripeSubscriptionId = stripeSubscription.id;
        if (stripePriceId) subscription.stripePriceId = stripePriceId;
        subscription.status = stripeSubscription.status;
        subscription.tier = tier;
        subscription.currentPeriodStart = stripeSubscription.current_period_start ? new Date(stripeSubscription.current_period_start * 1000) : undefined;
        subscription.currentPeriodEnd = stripeSubscription.current_period_end ? new Date(stripeSubscription.current_period_end * 1000) : undefined;
        subscription.cancelAtPeriodEnd = Boolean(stripeSubscription.cancel_at_period_end);
        subscription.canceledAt = stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : undefined;
        await subscription.save();
      } else {
        let userId = (stripeSubscription as any).metadata?.userId;
        if (!userId && stripeCustomerId) {
          const customer = await stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer;
          if (customer && typeof customer.metadata === 'object') {
            userId = customer.metadata.userId as string;
          }
        }

        const subscriptionData: any = {
          stripeCustomerId,
          stripeSubscriptionId: stripeSubscription.id,
          stripePriceId,
          status: stripeSubscription.status,
          tier,
          cancelAtPeriodEnd: Boolean(stripeSubscription.cancel_at_period_end),
          canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : undefined,
        };

        if (userId) {
          subscriptionData.userId = userId;
        }

        subscription = await Subscription.create(subscriptionData);
      }

      if (subscription?.userId) {
        await User.findByIdAndUpdate(subscription.userId, { subscriptionTier: subscription.tier });
      }
    };

    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      await handleSubscriptionEvent(event.data.object);
    } else if (event.type === 'customer.subscription.deleted') {
      const stripeSubscription = event.data.object;
      const subscription = await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: stripeSubscription.id },
        {
          status: 'canceled',
          tier: 'free',
          cancelAtPeriodEnd: false,
          canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : undefined,
        },
        { new: true }
      );
      if (subscription) {
        await User.findByIdAndUpdate(subscription.userId, { subscriptionTier: 'free' });
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

    await Subscription.findOneAndUpdate(
      { userId: req.user?._id },
      {
        stripeCustomerId: customerId,
        stripePriceId: priceId,
        status: 'incomplete',
        tier: 'free',
        cancelAtPeriodEnd: false,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

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
