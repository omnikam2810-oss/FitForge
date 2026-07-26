const fs = require('fs');
const path = require('path');

const files = {
  "src/models/Exercise.ts": `import mongoose, { Document, Schema } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  slug: string;
  category: 'compound' | 'isolation' | 'cardio' | 'flexibility' | 'plyometric';
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions?: string[];
  commonMistakes?: string[];
  formCheckpoints?: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  isCustom: boolean;
  createdBy?: mongoose.Types.ObjectId;
  isPremium: boolean;
  tags?: string[];
}

const ExerciseSchema = new Schema<IExercise>(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, enum: ['compound', 'isolation', 'cardio', 'flexibility', 'plyometric'], required: true },
    primaryMuscles: [{ type: String, required: true }],
    secondaryMuscles: [{ type: String }],
    equipment: [{ type: String }],
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    instructions: [{ type: String }],
    commonMistakes: [{ type: String }],
    formCheckpoints: [{ type: String }],
    videoUrl: { type: String },
    thumbnailUrl: { type: String },
    imageUrls: [{ type: String }],
    isCustom: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isPremium: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

ExerciseSchema.index({ name: 'text', tags: 'text' });

export const Exercise = mongoose.model<IExercise>('Exercise', ExerciseSchema);
`,
  "src/models/Workout.ts": `import mongoose, { Document, Schema } from 'mongoose';

export interface ISet {
  setNumber: number;
  setType: 'working' | 'warmup' | 'dropset' | 'failure';
  weight?: number;
  reps?: number;
  duration?: number;
  distance?: number;
  rpe?: number;
  rir?: number;
  completed: boolean;
  restAfter?: number;
}

export interface IWorkoutExercise {
  exerciseId: mongoose.Types.ObjectId;
  order: number;
  sets: ISet[];
  supersetGroup?: number;
  notes?: string;
}

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  name?: string;
  startedAt: Date;
  completedAt?: Date;
  durationSeconds?: number;
  programId?: mongoose.Types.ObjectId;
  programWeek?: number;
  programDay?: number;
  isAdHoc: boolean;
  exercises: IWorkoutExercise[];
  totalVolume?: number;
  totalSets?: number;
  muscleGroups?: string[];
  overallRPE?: number;
  mood?: 'great' | 'good' | 'okay' | 'tired' | 'terrible';
  notes?: string;
  offlineId?: string;
  synced: boolean;
}

const SetSchema = new Schema<ISet>({
  setNumber: { type: Number, required: true },
  setType: { type: String, enum: ['working', 'warmup', 'dropset', 'failure'], default: 'working' },
  weight: { type: Number },
  reps: { type: Number },
  duration: { type: Number },
  distance: { type: Number },
  rpe: { type: Number, min: 1, max: 10 },
  rir: { type: Number, min: 0, max: 5 },
  completed: { type: Boolean, default: false },
  restAfter: { type: Number }
}, { _id: false });

const WorkoutExerciseSchema = new Schema<IWorkoutExercise>({
  exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
  order: { type: Number, required: true },
  sets: [SetSchema],
  supersetGroup: { type: Number },
  notes: { type: String }
}, { _id: false });

const WorkoutSchema = new Schema<IWorkout>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String },
  startedAt: { type: Date, required: true },
  completedAt: { type: Date },
  durationSeconds: { type: Number },
  programId: { type: Schema.Types.ObjectId, ref: 'Program' },
  programWeek: { type: Number },
  programDay: { type: Number },
  isAdHoc: { type: Boolean, default: true },
  exercises: [WorkoutExerciseSchema],
  totalVolume: { type: Number },
  totalSets: { type: Number },
  muscleGroups: [{ type: String }],
  overallRPE: { type: Number, min: 1, max: 10 },
  mood: { type: String, enum: ['great', 'good', 'okay', 'tired', 'terrible'] },
  notes: { type: String },
  offlineId: { type: String },
  synced: { type: Boolean, default: true }
}, { timestamps: true });

export const Workout = mongoose.model<IWorkout>('Workout', WorkoutSchema);
`,
  "src/models/Program.ts": `import mongoose, { Document, Schema } from 'mongoose';

export interface IProgramExercise {
  exerciseId: mongoose.Types.ObjectId;
  order: number;
  targetSets: number;
  targetReps?: string;
  targetRPE?: number;
  restSeconds?: number;
  supersetGroup?: number;
  notes?: string;
}

export interface IProgramDay {
  dayNumber: number;
  name?: string;
  focus?: string[];
  exercises: IProgramExercise[];
  isRestDay: boolean;
}

export interface IProgramWeek {
  weekNumber: number;
  label?: string;
  days: IProgramDay[];
  intensityModifier: number;
}

export interface IProgram extends Document {
  name: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  type?: 'strength' | 'hypertrophy' | 'powerlifting' | 'endurance' | 'general' | 'sport_specific';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  daysPerWeek: number;
  requiredEquipment?: string[];
  weeks: IProgramWeek[];
  isPremium: boolean;
  isSystemProgram: boolean;
  createdBy?: mongoose.Types.ObjectId;
  subscriberCount: number;
  rating: number;
  ratingCount: number;
  tags?: string[];
}

const ProgramExerciseSchema = new Schema<IProgramExercise>({
  exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
  order: { type: Number, required: true },
  targetSets: { type: Number, required: true },
  targetReps: { type: String },
  targetRPE: { type: Number },
  restSeconds: { type: Number },
  supersetGroup: { type: Number },
  notes: { type: String }
}, { _id: false });

const ProgramDaySchema = new Schema<IProgramDay>({
  dayNumber: { type: Number, required: true },
  name: { type: String },
  focus: [{ type: String }],
  exercises: [ProgramExerciseSchema],
  isRestDay: { type: Boolean, default: false }
}, { _id: false });

const ProgramWeekSchema = new Schema<IProgramWeek>({
  weekNumber: { type: Number, required: true },
  label: { type: String },
  days: [ProgramDaySchema],
  intensityModifier: { type: Number, default: 1.0 }
}, { _id: false });

const ProgramSchema = new Schema<IProgram>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  coverImageUrl: { type: String },
  type: { type: String, enum: ['strength', 'hypertrophy', 'powerlifting', 'endurance', 'general', 'sport_specific'] },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  durationWeeks: { type: Number, required: true },
  daysPerWeek: { type: Number, required: true },
  requiredEquipment: [{ type: String }],
  weeks: [ProgramWeekSchema],
  isPremium: { type: Boolean, default: false },
  isSystemProgram: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  subscriberCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  tags: [{ type: String }]
}, { timestamps: true });

export const Program = mongoose.model<IProgram>('Program', ProgramSchema);
`,
  "src/models/Measurement.ts": `import mongoose, { Document, Schema } from 'mongoose';

export interface IMeasurement extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  bodyWeight?: number;
  bodyFatPercent?: number;
  muscleMass?: number;
  measurements?: {
    chest?: number; waist?: number; hips?: number;
    leftBicep?: number; rightBicep?: number;
    leftThigh?: number; rightThigh?: number;
    neck?: number; shoulders?: number;
    leftCalf?: number; rightCalf?: number;
    leftForearm?: number; rightForearm?: number;
  };
  photos?: Array<{ url: string; angle: 'front' | 'side' | 'back'; thumbnailUrl?: string }>;
  wearableData?: {
    restingHeartRate?: number;
    hrv?: number;
    sleepHours?: number;
    sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent';
    steps?: number;
    activeCalories?: number;
    recoveryScore?: number;
  };
  notes?: string;
}

const MeasurementSchema = new Schema<IMeasurement>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true },
  bodyWeight: { type: Number },
  bodyFatPercent: { type: Number },
  muscleMass: { type: Number },
  measurements: {
    chest: Number, waist: Number, hips: Number,
    leftBicep: Number, rightBicep: Number,
    leftThigh: Number, rightThigh: Number,
    neck: Number, shoulders: Number,
    leftCalf: Number, rightCalf: Number,
    leftForearm: Number, rightForearm: Number
  },
  photos: [{
    url: { type: String, required: true },
    angle: { type: String, enum: ['front', 'side', 'back'] },
    thumbnailUrl: String
  }],
  wearableData: {
    restingHeartRate: Number,
    hrv: Number,
    sleepHours: Number,
    sleepQuality: { type: String, enum: ['poor', 'fair', 'good', 'excellent'] },
    steps: Number,
    activeCalories: Number,
    recoveryScore: { type: Number, min: 0, max: 100 }
  },
  notes: { type: String }
}, { timestamps: true });

export const Measurement = mongoose.model<IMeasurement>('Measurement', MeasurementSchema);
`,
  "src/models/Subscription.ts": `import mongoose, { Document, Schema } from 'mongoose';

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
`,
  "src/models/CoachChat.ts": `import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  _id?: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'workout_summary';
  readAt?: Date;
  sentAt: Date;
}

export interface ICoachChat extends Document {
  userId: mongoose.Types.ObjectId;
  coachId: mongoose.Types.ObjectId;
  messages: IMessage[];
  lastMessageAt?: Date;
  unreadByUser: number;
  unreadByCoach: number;
  isActive: boolean;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ['image', 'video', 'workout_summary'] },
  readAt: { type: Date },
  sentAt: { type: Date, default: Date.now }
});

const CoachChatSchema = new Schema<ICoachChat>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coachId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [MessageSchema],
  lastMessageAt: { type: Date },
  unreadByUser: { type: Number, default: 0 },
  unreadByCoach: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const CoachChat = mongoose.model<ICoachChat>('CoachChat', CoachChatSchema);
`,
  "src/models/Challenge.ts": `import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  name: string;
  description?: string;
  coverImageUrl?: string;
  type: 'volume' | 'streak' | 'specific_exercise' | 'custom';
  targetMetric?: string;
  targetValue?: number;
  startDate: Date;
  endDate: Date;
  participants: Array<{
    userId: mongoose.Types.ObjectId;
    progress: number;
    joinedAt: Date;
    rank?: number;
  }>;
  isPremium: boolean;
  maxParticipants?: number;
  isActive: boolean;
}

const ChallengeSchema = new Schema<IChallenge>({
  name: { type: String, required: true },
  description: { type: String },
  coverImageUrl: { type: String },
  type: { type: String, enum: ['volume', 'streak', 'specific_exercise', 'custom'] },
  targetMetric: { type: String },
  targetValue: { type: Number },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participants: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    progress: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    rank: { type: Number }
  }],
  isPremium: { type: Boolean, default: false },
  maxParticipants: { type: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Challenge = mongoose.model<IChallenge>('Challenge', ChallengeSchema);
`,
  "src/utils/logger.ts": `import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
`,
  "src/utils/apiResponse.ts": `import { Response } from 'express';

export const success = (res: Response, data: any, message: string = 'Success', statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const error = (res: Response, message: string = 'Error', statusCode: number = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};
`,
  "src/utils/jwt.ts": `import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string, isRefresh = false) => {
  const secret = isRefresh ? env.JWT_REFRESH_SECRET : env.JWT_SECRET;
  return jwt.verify(token, secret);
};
`,
  "src/utils/hash.ts": `import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
`,
  "src/middleware/errorHandler.ts": `import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { error as sendError } from '../utils/apiResponse';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }
  
  return sendError(res, 'Internal Server Error', 500);
};
`,
  "src/middleware/rateLimiter.ts": `import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
`,
  "src/middleware/validator.ts": `import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { error } from '../utils/apiResponse';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error: validationError } = schema.validate(req.body);
    if (validationError) {
      return error(res, validationError.details[0].message, 400);
    }
    next();
  };
};
`,
  "src/middleware/auth.middleware.ts": `import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User, IUser } from '../models/User';
import { error } from '../utils/apiResponse';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return error(res, 'User not found', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401);
  }
};
`,
  "src/middleware/premium.middleware.ts": `import { Request, Response, NextFunction } from 'express';
import { error } from '../utils/apiResponse';

export const premiumMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.subscriptionTier !== 'premium') {
    return error(res, 'Premium subscription required', 403);
  }
  next();
};
`,
  "src/services/auth.service.ts": `import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

export const registerUser = async (data: any) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new AppError('Email already in use', 400);

  const user = await User.create(data);
  const accessToken = generateAccessToken(user._id as string);
  const refreshToken = generateRefreshToken(user._id as string);
  
  user.refreshToken = refreshToken;
  await user.save();
  
  return { user, accessToken, refreshToken };
};

export const loginUser = async (data: any) => {
  const user = await User.findOne({ email: data.email });
  if (!user) throw new AppError('Invalid credentials', 401);

  const isValid = await user.comparePassword(data.password);
  if (!isValid) throw new AppError('Invalid credentials', 401);

  const accessToken = generateAccessToken(user._id as string);
  const refreshToken = generateRefreshToken(user._id as string);
  
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const refresh = async (token: string) => {
  try {
    const decoded: any = verifyToken(token, true);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      throw new AppError('Invalid refresh token', 401);
    }

    const accessToken = generateAccessToken(user._id as string);
    const newRefreshToken = generateRefreshToken(user._id as string);
    
    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw new AppError('Invalid or expired refresh token', 401);
  }
};

export const logoutUser = async (userId: string) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};
`,
  "src/controllers/auth.controller.ts": `import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { success, error } from '../utils/apiResponse';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.registerUser(req.body);
    return success(res, data, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.loginUser(req.body);
    return success(res, data, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required', 400);
    const data = await authService.refresh(refreshToken);
    return success(res, data, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      await authService.logoutUser(req.user._id as string);
    }
    return success(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};
`,
  "src/controllers/user.controller.ts": `import { Request, Response, NextFunction } from 'express';
import { success } from '../utils/apiResponse';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return success(res, req.user, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder logic
    return success(res, req.user, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

export const onboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return success(res, req.user, 'Onboarding complete');
  } catch (err) {
    next(err);
  }
};
`,
  "src/routes/auth.routes.ts": `import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

export default router;
`,
  "src/routes/user.routes.ts": `import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/onboarding', userController.onboarding);

export default router;
`,
  "src/routes/exercise.routes.ts": `import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => success(res, []));
router.get('/:id', (req, res) => success(res, {}));
router.post('/', (req, res) => success(res, {}, 'Created exercise', 201));

export default router;
`,
  "src/routes/workout.routes.ts": `import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => success(res, []));
router.get('/:id', (req, res) => success(res, {}));
router.post('/', (req, res) => success(res, {}, 'Created workout', 201));
router.put('/:id', (req, res) => success(res, {}, 'Updated workout'));

export default router;
`,
  "src/routes/program.routes.ts": `import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => success(res, []));
router.get('/:id', (req, res) => success(res, {}));
router.post('/:id/subscribe', (req, res) => success(res, {}, 'Subscribed to program'));

export default router;
`,
  "src/routes/measurement.routes.ts": `import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => success(res, []));
router.post('/', (req, res) => success(res, {}, 'Created measurement', 201));
router.put('/:id', (req, res) => success(res, {}, 'Updated measurement'));
router.delete('/:id', (req, res) => success(res, null, 'Deleted measurement'));

export default router;
`,
  "src/routes/subscription.routes.ts": `import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { success } from '../utils/apiResponse';

const router = Router();

router.post('/webhook', (req, res) => success(res, null, 'Webhook received'));

router.use(authMiddleware);
router.post('/create-checkout', (req, res) => success(res, { url: 'checkout_url' }));
router.get('/status', (req, res) => success(res, { status: 'active' }));

export default router;
`,
  "src/routes/coach.routes.ts": `import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { premiumMiddleware } from '../middleware/premium.middleware';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware, premiumMiddleware);

router.get('/chat', (req, res) => success(res, []));
router.post('/chat/message', (req, res) => success(res, {}, 'Message sent', 201));

export default router;
`,
  "src/routes/community.routes.ts": `import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { premiumMiddleware } from '../middleware/premium.middleware';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.get('/feed', (req, res) => success(res, []));
router.get('/challenges', (req, res) => success(res, []));
router.post('/challenges/:id/join', premiumMiddleware, (req, res) => success(res, {}, 'Joined challenge'));

export default router;
`,
  "src/routes/health.routes.ts": `import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);

router.post('/sync', (req, res) => success(res, {}, 'Health data synced'));

export default router;
`,
  "src/app.ts": `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import exerciseRoutes from './routes/exercise.routes';
import workoutRoutes from './routes/workout.routes';
import programRoutes from './routes/program.routes';
import measurementRoutes from './routes/measurement.routes';
import subscriptionRoutes from './routes/subscription.routes';
import coachRoutes from './routes/coach.routes';
import communityRoutes from './routes/community.routes';
import healthRoutes from './routes/health.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/exercises', exerciseRoutes);
app.use('/api/v1/workouts', workoutRoutes);
app.use('/api/v1/programs', programRoutes);
app.use('/api/v1/measurements', measurementRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/coach', coachRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/health', healthRoutes);

app.use(errorHandler);

export default app;
`,
  "src/server.ts": `import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { logger } from './utils/logger';

const startServer = async () => {
  await connectDB();
  
  const server = app.listen(env.PORT, () => {
    logger.info(\`Server running on port \${env.PORT}\`);
  });

  const gracefulShutdown = () => {
    logger.info('Shutting down gracefully...');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
};

startServer();
`
};

const baseDir = "c:\\Users\\Omkar\\OneDrive\\Desktop\\Health\\backend";

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(baseDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

console.log('All files created successfully.');
