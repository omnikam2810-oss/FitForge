import { Exercise } from '../models/Exercise';
import { Program } from '../models/Program';
import { Challenge } from '../models/Challenge';

export const ensureDefaultExercises = async () => {
  if (await Exercise.exists({ isSystemProgram: { $exists: false } as any })) {
    return Exercise.find({ isCustom: false }).sort({ name: 1 });
  }

  const exercises = await Exercise.insertMany([
    {
      name: 'Barbell Back Squat',
      slug: 'barbell-back-squat',
      category: 'compound',
      primaryMuscles: ['quads', 'glutes'],
      secondaryMuscles: ['hamstrings', 'core'],
      equipment: ['barbell', 'rack'],
      difficulty: 'intermediate',
      instructions: ['Brace hard', 'Sit between the hips', 'Drive through mid-foot'],
      formCheckpoints: ['Neutral spine', 'Knees track over toes', 'Full-foot pressure'],
      videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=900&q=80',
      isCustom: false,
      isPremium: false,
      tags: ['strength', 'legs'],
    },
    {
      name: 'Dumbbell Bench Press',
      slug: 'dumbbell-bench-press',
      category: 'compound',
      primaryMuscles: ['chest'],
      secondaryMuscles: ['triceps', 'shoulders'],
      equipment: ['dumbbells', 'bench'],
      difficulty: 'beginner',
      instructions: ['Set shoulder blades', 'Lower under control', 'Press smoothly'],
      formCheckpoints: ['Wrists stacked', 'Elbows 30-60 degrees', 'Stable feet'],
      videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80',
      isCustom: false,
      isPremium: false,
      tags: ['hypertrophy', 'push'],
    },
    {
      name: 'Pull-Up',
      slug: 'pull-up',
      category: 'compound',
      primaryMuscles: ['back'],
      secondaryMuscles: ['biceps', 'core'],
      equipment: ['pull-up bar'],
      difficulty: 'intermediate',
      instructions: ['Start from control', 'Pull chest toward bar', 'Lower fully'],
      formCheckpoints: ['No swinging', 'Shoulders down', 'Ribs stacked'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=80',
      isCustom: false,
      isPremium: false,
      tags: ['strength', 'pull'],
    },
    {
      name: 'Tempo Romanian Deadlift',
      slug: 'tempo-romanian-deadlift',
      category: 'compound',
      primaryMuscles: ['hamstrings', 'glutes'],
      secondaryMuscles: ['back'],
      equipment: ['barbell', 'dumbbells'],
      difficulty: 'advanced',
      instructions: ['Three-second eccentric', 'Keep lats tight', 'Stand tall without leaning back'],
      formCheckpoints: ['Soft knees', 'Hips travel back', 'Bar stays close'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=80',
      isCustom: false,
      isPremium: true,
      tags: ['premium', 'posterior-chain'],
    },
  ]);

  return exercises;
};

export const ensureDefaultPrograms = async () => {
  const existing = await Program.find().sort({ subscriberCount: -1 });
  if (existing.length) return existing;

  const exercises = await ensureDefaultExercises();
  const bySlug = new Map(exercises.map((exercise) => [exercise.slug, exercise._id]));

  return Program.insertMany([
    {
      name: 'Foundation Strength',
      slug: 'foundation-strength',
      description: 'A 4-week strength base with measured volume increases.',
      type: 'strength',
      difficulty: 'beginner',
      durationWeeks: 4,
      daysPerWeek: 3,
      requiredEquipment: ['dumbbells', 'bench'],
      isPremium: false,
      isSystemProgram: true,
      subscriberCount: 1200,
      rating: 4.7,
      ratingCount: 180,
      tags: ['strength', 'beginner'],
      weeks: [1, 2, 3, 4].map((week) => ({
        weekNumber: week,
        label: week === 4 ? 'Peak volume' : `Build ${week}`,
        intensityModifier: 0.9 + week * 0.05,
        days: [
          {
            dayNumber: 1,
            name: 'Lower Strength',
            focus: ['legs', 'core'],
            isRestDay: false,
            exercises: [{ exerciseId: bySlug.get('barbell-back-squat'), order: 1, targetSets: 3 + Math.floor(week / 2), targetReps: '5-8', targetRPE: 7, restSeconds: 120 }],
          },
          {
            dayNumber: 2,
            name: 'Upper Push',
            focus: ['chest', 'shoulders'],
            isRestDay: false,
            exercises: [{ exerciseId: bySlug.get('dumbbell-bench-press'), order: 1, targetSets: 3, targetReps: '8-10', targetRPE: 7, restSeconds: 90 }],
          },
          {
            dayNumber: 3,
            name: 'Pull + Posterior',
            focus: ['back'],
            isRestDay: false,
            exercises: [{ exerciseId: bySlug.get('pull-up'), order: 1, targetSets: 3, targetReps: 'AMRAP', targetRPE: 8, restSeconds: 120 }],
          },
        ],
      })),
    },
    {
      name: 'Athlete Pro Hypertrophy',
      slug: 'athlete-pro-hypertrophy',
      description: 'Premium 6-week hypertrophy block with tempo work and fatigue control.',
      type: 'hypertrophy',
      difficulty: 'intermediate',
      durationWeeks: 6,
      daysPerWeek: 4,
      requiredEquipment: ['barbell', 'dumbbells', 'bench'],
      isPremium: true,
      isSystemProgram: true,
      subscriberCount: 840,
      rating: 4.9,
      ratingCount: 96,
      tags: ['premium', 'hypertrophy'],
      weeks: [1, 2, 3, 4, 5, 6].map((week) => ({
        weekNumber: week,
        label: week === 6 ? 'Deload and test' : `Progressive overload ${week}`,
        intensityModifier: week === 6 ? 0.75 : 0.95 + week * 0.04,
        days: [1, 2, 3, 4].map((day) => ({
          dayNumber: day,
          name: ['Push Volume', 'Lower Tempo', 'Pull Density', 'Full Body Pump'][day - 1],
          focus: day % 2 ? ['chest', 'back'] : ['legs', 'glutes'],
          isRestDay: false,
          exercises: [
            { exerciseId: bySlug.get(day === 2 ? 'tempo-romanian-deadlift' : 'dumbbell-bench-press'), order: 1, targetSets: week === 6 ? 2 : 3 + Math.floor(week / 3), targetReps: '8-12', targetRPE: week === 6 ? 6 : 8, restSeconds: 75 },
          ],
        })),
      })),
    },
  ]);
};

export const ensureDefaultChallenges = async () => {
  const existing = await Challenge.find({ isActive: true });
  if (existing.length) return existing;

  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 21);

  return Challenge.insertMany([
    {
      name: '21-Day Volume Climb',
      description: 'Accumulate training volume and climb the board.',
      type: 'volume',
      targetMetric: 'totalVolume',
      targetValue: 50000,
      startDate: now,
      endDate: end,
      participants: [],
      isPremium: false,
      isActive: true,
    },
    {
      name: 'Premium Consistency League',
      description: 'Premium members compete on weekly completed sessions.',
      type: 'streak',
      targetMetric: 'completedWorkouts',
      targetValue: 12,
      startDate: now,
      endDate: end,
      participants: [],
      isPremium: true,
      isActive: true,
    },
  ]);
};
