import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import exerciseRoutes from './routes/exercise.routes';
import workoutRoutes from './routes/workout.routes';
import programRoutes from './routes/program.routes';
import measurementRoutes from './routes/measurement.routes';
import subscriptionRoutes from './routes/subscription.routes';
import coachRoutes from './routes/coach.routes';
import communityRoutes from './routes/community.routes';
import healthRoutes from './routes/health.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/exercises', exerciseRoutes);
app.use('/api/v1/workouts', workoutRoutes);
app.use('/api/v1/programs', programRoutes);
app.use('/api/v1/measurements', measurementRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/coach', coachRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/health', healthRoutes);

app.use(errorHandler);

export default app;
