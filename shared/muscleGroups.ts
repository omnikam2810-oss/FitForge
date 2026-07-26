export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'abs'
  | 'obliques'
  | 'lower_back'
  | 'traps'
  | 'lats'
  | 'hip_flexors'
  | 'adductors'
  | 'abductors';

export const MUSCLE_GROUPS: { id: MuscleGroup; label: string; bodyRegion: 'upper' | 'lower' | 'core' }[] = [
  { id: 'chest', label: 'Chest', bodyRegion: 'upper' },
  { id: 'back', label: 'Back', bodyRegion: 'upper' },
  { id: 'shoulders', label: 'Shoulders', bodyRegion: 'upper' },
  { id: 'biceps', label: 'Biceps', bodyRegion: 'upper' },
  { id: 'triceps', label: 'Triceps', bodyRegion: 'upper' },
  { id: 'forearms', label: 'Forearms', bodyRegion: 'upper' },
  { id: 'traps', label: 'Traps', bodyRegion: 'upper' },
  { id: 'lats', label: 'Lats', bodyRegion: 'upper' },
  { id: 'quadriceps', label: 'Quadriceps', bodyRegion: 'lower' },
  { id: 'hamstrings', label: 'Hamstrings', bodyRegion: 'lower' },
  { id: 'glutes', label: 'Glutes', bodyRegion: 'lower' },
  { id: 'calves', label: 'Calves', bodyRegion: 'lower' },
  { id: 'hip_flexors', label: 'Hip Flexors', bodyRegion: 'lower' },
  { id: 'adductors', label: 'Adductors', bodyRegion: 'lower' },
  { id: 'abductors', label: 'Abductors', bodyRegion: 'lower' },
  { id: 'abs', label: 'Abs', bodyRegion: 'core' },
  { id: 'obliques', label: 'Obliques', bodyRegion: 'core' },
  { id: 'lower_back', label: 'Lower Back', bodyRegion: 'core' },
];
