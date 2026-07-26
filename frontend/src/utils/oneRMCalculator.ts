export const calculateEpley = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
};

export const calculateBrzycki = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  return weight * (36 / (37 - reps));
};

export const getEstimated1RM = (weight: number, reps: number, formula: 'Epley' | 'Brzycki' = 'Epley'): number => {
  if (reps <= 0 || weight <= 0) return 0;
  
  const oneRM = formula === 'Epley' 
    ? calculateEpley(weight, reps) 
    : calculateBrzycki(weight, reps);
    
  return Math.round(oneRM * 10) / 10;
};
