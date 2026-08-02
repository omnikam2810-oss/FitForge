import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()
});

export const createWorkoutSchema = Joi.object({
  name: Joi.string().required(),
  exercises: Joi.array().items(Joi.object({
    exerciseId: Joi.string().required(),
    order: Joi.number(),
    sets: Joi.array(),
    notes: Joi.string().optional()
  })).optional(),
  notes: Joi.string().optional(),
  startedAt: Joi.date().optional(),
  completedAt: Joi.date().optional()
}).unknown(true);

export const updateWorkoutSchema = Joi.object({
  name: Joi.string().optional(),
  exercises: Joi.array().optional(),
  notes: Joi.string().optional(),
  completedAt: Joi.date().optional()
}).unknown(true);

export const createExerciseSchema = Joi.object({
  name: Joi.string().required(),
  primaryMuscles: Joi.array().items(Joi.string()).required(),
  equipment: Joi.array().items(Joi.string()).required(),
  category: Joi.string().optional(),
  difficulty: Joi.string().optional()
}).unknown(true);

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  avatarUrl: Joi.string().optional(),
  preferredUnits: Joi.string().optional(),
  notifications: Joi.boolean().optional(),
  displayName: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().optional(),
  unitSystem: Joi.string().optional(),
  darkMode: Joi.boolean().optional(),
  notificationsEnabled: Joi.boolean().optional(),
  reminderSchedule: Joi.array().optional(),
  expoPushToken: Joi.string().optional()
}).unknown(false);

export const onboardingSchema = Joi.object({
  experienceLevel: Joi.string().required(),
  weeklyFrequency: Joi.number().required(),
  goals: Joi.array().optional(),
  availableEquipment: Joi.array().optional(),
  injuries: Joi.array().optional()
}).unknown(true);
