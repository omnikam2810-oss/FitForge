import { Request, Response, NextFunction } from 'express';
import { success } from '../utils/apiResponse';
import { Program } from '../models/Program';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return success(res, req.user, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allowedFields = [
      'displayName',
      'avatarUrl',
      'dateOfBirth',
      'gender',
      'unitSystem',
      'darkMode',
      'notificationsEnabled',
      'reminderSchedule',
      'expoPushToken',
    ];

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field) && req.user) {
        (req.user as any)[field] = req.body[field];
      }
    }

    await req.user?.save();
    return success(res, req.user, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

export const onboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return success(res, null, 'Onboarding complete');

    const fields = ['goals', 'experienceLevel', 'availableEquipment', 'injuries', 'weeklyFrequency'];
    for (const field of fields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        (req.user as any)[field] = req.body[field];
      }
    }

    const goals = req.body.goals ?? req.user.goals ?? [];
    const goalToType: Record<string, string> = {
      strength: 'strength',
      muscle_gain: 'hypertrophy',
      endurance: 'endurance',
      fat_loss: 'general',
      general_fitness: 'general',
    };

    const preferredTypes = goals.map((goal: string) => goalToType[goal]).filter(Boolean);
    const programQuery: any = {
      difficulty: req.body.experienceLevel ?? req.user.experienceLevel ?? 'beginner',
      daysPerWeek: { $lte: req.body.weeklyFrequency ?? req.user.weeklyFrequency ?? 4 },
    };

    if (preferredTypes.length) programQuery.type = { $in: preferredTypes };
    if ((req.body.availableEquipment ?? req.user.availableEquipment)?.length) {
      programQuery.requiredEquipment = { $not: { $elemMatch: { $nin: req.body.availableEquipment ?? req.user.availableEquipment } } };
    }

    const recommendedProgram = await Program.findOne(programQuery).sort({ rating: -1, subscriberCount: -1 });
    if (recommendedProgram) req.user.currentProgramId = recommendedProgram._id;

    req.user.onboardingComplete = true;
    await req.user.save();

    return success(res, { user: req.user, recommendedProgram }, 'Onboarding complete');
  } catch (err) {
    next(err);
  }
};
