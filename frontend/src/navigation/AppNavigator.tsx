import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { RootState } from '../store/store';

import { AuthStackParamList, OnboardingStackParamList, WorkoutTabParamList, ExercisesTabParamList, ProgressTabParamList, SocialTabParamList, ProfileTabParamList, MainTabsParamList } from './types';

// Auth Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

// Onboarding
import { OnboardingFlowScreen } from '../screens/OnboardingFlowScreen';

// Workout Screens
import { WorkoutHomeScreen } from '../screens/workout/WorkoutHomeScreen';
import { ActiveWorkoutScreen } from '../screens/workout/ActiveWorkoutScreen';
import { WorkoutSummaryScreen } from '../screens/workout/WorkoutSummaryScreen';
import { ExercisePickerScreen } from '../screens/workout/ExercisePickerScreen';
import { PlateCalculatorScreen } from '../screens/workout/PlateCalculatorScreen';
import { WorkoutHistoryScreen } from '../screens/workout/WorkoutHistoryScreen';
import { WorkoutDetailScreen } from '../screens/workout/WorkoutDetailScreen';
import { RoutineListScreen } from '../screens/workout/RoutineListScreen';
import { RoutineBuilderScreen } from '../screens/workout/RoutineBuilderScreen';

// Exercise Screens
import { ExerciseBrowserScreen } from '../screens/exercises/ExerciseBrowserScreen';
import { ExerciseDetailScreen } from '../screens/exercises/ExerciseDetailScreen';

// Progress Screens
import { ProgressDashboardScreen } from '../screens/progress/ProgressDashboardScreen';
import { ExerciseProgressScreen } from '../screens/progress/ExerciseProgressScreen';
import { MeasurementsScreen } from '../screens/progress/MeasurementsScreen';

// Social Screens
import { ActivityFeedScreen } from '../screens/social/ActivityFeedScreen';
import { LeaderboardScreen } from '../screens/social/LeaderboardScreen';
import { UserProfileScreen } from '../screens/social/UserProfileScreen';

// Profile Screens
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { AITrainerScreen } from '../screens/profile/AITrainerScreen';
import { DataExportScreen } from '../screens/profile/DataExportScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const WorkoutStack = createNativeStackNavigator<WorkoutTabParamList>();
const ExercisesStack = createNativeStackNavigator<ExercisesTabParamList>();
const ProgressStack = createNativeStackNavigator<ProgressTabParamList>();
const SocialStack = createNativeStackNavigator<SocialTabParamList>();
const ProfileStack = createNativeStackNavigator<ProfileTabParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="OnboardingFlow" component={OnboardingFlowScreen} />
    </OnboardingStack.Navigator>
  );
}

function WorkoutNavigator() {
  return (
    <WorkoutStack.Navigator screenOptions={{ headerShown: false }}>
      <WorkoutStack.Screen name="WorkoutHome" component={WorkoutHomeScreen} />
      <WorkoutStack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
      <WorkoutStack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} />
      <WorkoutStack.Screen name="ExercisePicker" component={ExercisePickerScreen} />
      <WorkoutStack.Screen name="PlateCalculator" component={PlateCalculatorScreen} />
      <WorkoutStack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
      <WorkoutStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
      <WorkoutStack.Screen name="RoutineList" component={RoutineListScreen} />
      <WorkoutStack.Screen name="RoutineBuilder" component={RoutineBuilderScreen} />
    </WorkoutStack.Navigator>
  );
}

function ExercisesNavigator() {
  return (
    <ExercisesStack.Navigator screenOptions={{ headerShown: false }}>
      <ExercisesStack.Screen name="ExerciseBrowser" component={ExerciseBrowserScreen} />
      <ExercisesStack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
    </ExercisesStack.Navigator>
  );
}

function ProgressNavigator() {
  return (
    <ProgressStack.Navigator screenOptions={{ headerShown: false }}>
      <ProgressStack.Screen name="ProgressDashboard" component={ProgressDashboardScreen} />
      <ProgressStack.Screen name="ExerciseProgress" component={ExerciseProgressScreen} />
      <ProgressStack.Screen name="Measurements" component={MeasurementsScreen} />
    </ProgressStack.Navigator>
  );
}

function SocialNavigator() {
  return (
    <SocialStack.Navigator screenOptions={{ headerShown: false }}>
      <SocialStack.Screen name="ActivityFeed" component={ActivityFeedScreen} />
      <SocialStack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <SocialStack.Screen name="UserProfile" component={UserProfileScreen} />
    </SocialStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="AITrainer" component={AITrainerScreen} />
      <ProfileStack.Screen name="DataExport" component={DataExportScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabsNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1D27',
          borderTopColor: '#2D3142',
        },
        tabBarActiveTintColor: theme.colors.brand.primary,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'barbell';
          
          if (route.name === 'WorkoutTab') iconName = focused ? 'barbell' : 'barbell-outline';
          else if (route.name === 'ExercisesTab') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'ProgressTab') iconName = focused ? 'trending-up' : 'trending-up-outline';
          else if (route.name === 'SocialTab') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="WorkoutTab" component={WorkoutNavigator} options={{ tabBarLabel: 'Workout' }} />
      <Tab.Screen name="ExercisesTab" component={ExercisesNavigator} options={{ tabBarLabel: 'Exercises' }} />
      <Tab.Screen name="ProgressTab" component={ProgressNavigator} options={{ tabBarLabel: 'Progress' }} />
      <Tab.Screen name="SocialTab" component={SocialNavigator} options={{ tabBarLabel: 'Social' }} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { showOnboarding } = useSelector((state: RootState) => state.ui);

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  if (showOnboarding) {
    return <OnboardingNavigator />;
  }

  return <MainTabsNavigator />;
}
