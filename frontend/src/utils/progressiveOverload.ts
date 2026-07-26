export const suggestNextWeight = (currentWeight: number, currentReps: number, targetReps: number): number => {
  if (currentReps >= targetReps) {
    const increase = currentWeight > 20 ? 2.5 : 1.25;
    return currentWeight + increase;
  }
  return currentWeight;
};

export const shouldDeload = (failedAttempts: number): boolean => {
  return failedAttempts >= 2;
};
