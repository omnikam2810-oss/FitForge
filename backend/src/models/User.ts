import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  authProvider: 'email' | 'google' | 'apple';
  socialId?: string;
  refreshToken?: string;
  displayName: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  unitSystem: 'metric' | 'imperial';
  goals?: Array<'strength' | 'fat_loss' | 'endurance' | 'muscle_gain' | 'general_fitness'>;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  availableEquipment?: string[];
  injuries?: Array<{ bodyPart: string; severity: 'mild' | 'moderate' | 'severe'; notes?: string }>;
  weeklyFrequency: number;
  onboardingComplete: boolean;
  subscriptionTier: 'free' | 'premium';
  stripeCustomerId?: string;
  healthKitEnabled: boolean;
  googleFitEnabled: boolean;
  wearableTokens?: mongoose.Schema.Types.Mixed;
  darkMode: boolean;
  notificationsEnabled: boolean;
  reminderSchedule?: Array<{ dayOfWeek: number; time: string }>;
  currentProgramId?: mongoose.Types.ObjectId;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  expoPushToken?: string;
  coachId?: mongoose.Types.ObjectId;
  isCoach: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String },
    authProvider: { type: String, enum: ['email', 'google', 'apple'], default: 'email' },
    socialId: { type: String },
    refreshToken: { type: String },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'] },
    unitSystem: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
    goals: [{ type: String, enum: ['strength', 'fat_loss', 'endurance', 'muscle_gain', 'general_fitness'] }],
    experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    availableEquipment: [{ type: String }],
    injuries: [
      {
        bodyPart: String,
        severity: { type: String, enum: ['mild', 'moderate', 'severe'] },
        notes: String,
      },
    ],
    weeklyFrequency: { type: Number, min: 1, max: 7, default: 4 },
    onboardingComplete: { type: Boolean, default: false },
    subscriptionTier: { type: String, enum: ['free', 'premium'], default: 'free' },
    stripeCustomerId: { type: String },
    healthKitEnabled: { type: Boolean, default: false },
    googleFitEnabled: { type: Boolean, default: false },
    wearableTokens: { type: Schema.Types.Mixed },
    darkMode: { type: Boolean, default: false },
    notificationsEnabled: { type: Boolean, default: true },
    reminderSchedule: [
      {
        dayOfWeek: { type: Number, min: 0, max: 6 },
        time: String,
      },
    ],
    currentProgramId: { type: Schema.Types.ObjectId, ref: 'Program' },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalWorkouts: { type: Number, default: 0 },
    expoPushToken: { type: String },
    coachId: { type: Schema.Types.ObjectId, ref: 'User' },
    isCoach: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash') || !this.passwordHash) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);
