import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { premiumMiddleware } from '../middleware/premium.middleware';
import { success } from '../utils/apiResponse';

const router = Router();
router.use(authMiddleware);
router.use(premiumMiddleware);

router.post('/generate-plan', (req, res) => {
  const mockPlan = {
    planName: 'AI Generated Plan',
    daysPerWeek: req.body.daysPerWeek || 3,
    workouts: [
      {
        name: 'Full Body A',
        exercises: [
          { name: 'Squat', sets: 3, reps: 8 },
          { name: 'Bench Press', sets: 3, reps: 8 },
          { name: 'Barbell Row', sets: 3, reps: 10 }
        ]
      }
    ]
  };
  return success(res, mockPlan, 'Plan generated successfully');
});

router.get('/suggestions', (req, res) => {
  const suggestions = [
    { exercise: 'Bench Press', suggestion: 'Increase weight by 2.5kg' },
    { exercise: 'Squat', suggestion: 'Try for 1 more rep' }
  ];
  return success(res, suggestions);
});

export default router;
