export interface Measurement {
  id: string;
  date: string;
  value: number;
  unit: string;
}

export interface BodyMeasurements {
  id: string;
  date: string;
  weight?: number;
  bodyFatPercentage?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  frontUrl?: string;
  sideUrl?: string;
  backUrl?: string;
}

export interface WearableData {
  id: string;
  date: string;
  steps?: number;
  caloriesBurned?: number;
  avgHeartRate?: number;
  sleepDurationMinutes?: number;
}
