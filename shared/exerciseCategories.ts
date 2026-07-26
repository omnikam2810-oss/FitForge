export type ExerciseCategory = 'compound' | 'isolation' | 'cardio' | 'flexibility' | 'plyometric';

export const EXERCISE_CATEGORIES: { id: ExerciseCategory; label: string; description: string }[] = [
  { id: 'compound', label: 'Compound', description: 'Multi-joint movements that work multiple muscle groups' },
  { id: 'isolation', label: 'Isolation', description: 'Single-joint movements targeting specific muscles' },
  { id: 'cardio', label: 'Cardio', description: 'Cardiovascular endurance exercises' },
  { id: 'flexibility', label: 'Flexibility', description: 'Stretching and mobility work' },
  { id: 'plyometric', label: 'Plyometric', description: 'Explosive power movements' },
];
