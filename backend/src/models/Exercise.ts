import mongoose, { Document, Schema } from 'mongoose';

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
