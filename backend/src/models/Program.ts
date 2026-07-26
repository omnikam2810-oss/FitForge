import mongoose, { Document, Schema } from 'mongoose';

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
