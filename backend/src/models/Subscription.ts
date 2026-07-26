import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  tier: 'free' | 'premium';
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete';
  billingInterval?: 'monthly' | 'annual';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  canceledAt?: Date;
  cancelAtPeriodEnd: boolean;
  lastPaymentAmount?: number;
  lastPaymentDate?: Date;
  currency: string;
  appleOriginalTransactionId?: string;
  googlePurchaseToken?: string;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  stripeCustomerId: { type: String, required: true },
  stripeSubscriptionId: { type: String },
  stripePriceId: { type: String },
  tier: { type: String, enum: ['free', 'premium'], default: 'free' },
  status: { type: String, enum: ['active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete'], default: 'active' },
  billingInterval: { type: String, enum: ['monthly', 'annual'] },
  currentPeriodStart: { type: Date },
  currentPeriodEnd: { type: Date },
  trialStart: { type: Date },
  trialEnd: { type: Date },
  canceledAt: { type: Date },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  lastPaymentAmount: { type: Number },
  lastPaymentDate: { type: Date },
  currency: { type: String, default: 'usd' },
  appleOriginalTransactionId: { type: String },
  googlePurchaseToken: { type: String }
}, { timestamps: true });

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
