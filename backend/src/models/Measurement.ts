import mongoose, { Document, Schema } from 'mongoose';

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
