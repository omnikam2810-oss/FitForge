import mongoose, { Document, Schema } from 'mongoose';

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
