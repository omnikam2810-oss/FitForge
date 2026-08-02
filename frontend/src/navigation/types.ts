import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type OnboardingStackParamList = {
  OnboardingFlow: undefined;
};

export type WorkoutTabParamList = {
  WorkoutHome: undefined;
  ActiveWorkout: undefined;
  WorkoutSummary: undefined;
  ExercisePicker: undefined;
  PlateCalculator: undefined;
  WorkoutHistory: undefined;
  WorkoutDetail: { id: string };
  RoutineList: undefined;
  RoutineBuilder: undefined;
};

export type ExercisesTabParamList = {
  ExerciseBrowser: undefined;
  ExerciseDetail: { id: string };
};

export type ProgressTabParamList = {
  ProgressDashboard: undefined;
  ExerciseProgress: undefined;
  Measurements: undefined;
};

export type SocialTabParamList = {
  ActivityFeed: undefined;
  Leaderboard: undefined;
  UserProfile: { userId: string };
};

export type ProfileTabParamList = {
  Profile: undefined;
  AITrainer: undefined;
  DataExport: undefined;
};

export type MainTabsParamList = {
  WorkoutTab: NavigatorScreenParams<WorkoutTabParamList>;
  ExercisesTab: NavigatorScreenParams<ExercisesTabParamList>;
  ProgressTab: NavigatorScreenParams<ProgressTabParamList>;
  SocialTab: NavigatorScreenParams<SocialTabParamList>;
  ProfileTab: NavigatorScreenParams<ProfileTabParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
};
