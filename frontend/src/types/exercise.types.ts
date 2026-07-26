export enum MuscleGroup {
  Chest = 'Chest',
  Back = 'Back',
  Legs = 'Legs',
  Arms = 'Arms',
  Shoulders = 'Shoulders',
  Core = 'Core',
  FullBody = 'Full Body',
}

export enum Equipment {
  Barbell = 'Barbell',
  Dumbbell = 'Dumbbell',
  Kettlebell = 'Kettlebell',
  Machine = 'Machine',
  Cable = 'Cable',
  Bodyweight = 'Bodyweight',
  Bands = 'Bands',
  None = 'None',
}

export enum ExerciseCategory {
  Strength = 'Strength',
  Cardio = 'Cardio',
  Flexibility = 'Flexibility',
  Mobility = 'Mobility',
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  category: ExerciseCategory;
  videoUrl?: string;
  thumbnailUrl?: string;
}
