import mongoose, { Document, Schema } from 'mongoose';

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
