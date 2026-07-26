export type SubscriptionTier = 'free' | 'premium';

export interface TierFeature {
  name: string;
  freeAccess: boolean;
  premiumAccess: boolean;
}

export const SUBSCRIPTION_TIERS = {
  free: {
    id: 'free' as const,
    name: 'Free',
    price: 0,
    features: [
      'Basic exercise library',
      'Workout logging',
      'Basic progress tracking',
      'Up to 3 saved workouts',
      'Beginner programs',
    ],
  },
  premium: {
    id: 'premium' as const,
    name: 'Premium',
    monthlyPrice: 9.99,
    annualPrice: 79.99,
    trialDays: 7,
    features: [
      'Full exercise library with videos',
      'Unlimited workout logging',
      'Advanced analytics & charts',
      'All training programs',
      'AI form check',
      '1:1 coaching access',
      'Community & challenges',
      'Wearable integration',
      'Offline mode',
      'Priority support',
    ],
  },
} as const;

export const TIER_FEATURES: TierFeature[] = [
  { name: 'Exercise Library', freeAccess: true, premiumAccess: true },
  { name: 'Workout Logging', freeAccess: true, premiumAccess: true },
  { name: 'Basic Progress Tracking', freeAccess: true, premiumAccess: true },
  { name: 'Video Demonstrations', freeAccess: false, premiumAccess: true },
  { name: 'Advanced Analytics', freeAccess: false, premiumAccess: true },
  { name: 'All Training Programs', freeAccess: false, premiumAccess: true },
  { name: 'AI Form Check', freeAccess: false, premiumAccess: true },
  { name: 'Coaching Access', freeAccess: false, premiumAccess: true },
  { name: 'Community Features', freeAccess: false, premiumAccess: true },
  { name: 'Wearable Integration', freeAccess: false, premiumAccess: true },
  { name: 'Offline Mode', freeAccess: false, premiumAccess: true },
];
