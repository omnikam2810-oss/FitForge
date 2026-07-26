export enum UserGoal {
  BuildMuscle = 'BuildMuscle',
  LoseWeight = 'LoseWeight',
  MaintainWeight = 'MaintainWeight',
  ImproveEndurance = 'ImproveEndurance',
  IncreaseStrength = 'IncreaseStrength',
}

export enum ExperienceLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export interface InjuryFlag {
  id: string;
  bodyPart: string;
  description: string;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  goals: UserGoal[];
  experienceLevel: ExperienceLevel;
  injuryFlags: InjuryFlag[];
  createdAt: string;
  profileImageUrl?: string;
}
