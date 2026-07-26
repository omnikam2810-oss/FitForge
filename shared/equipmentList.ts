export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'kettlebell'
  | 'cable_machine'
  | 'smith_machine'
  | 'pull_up_bar'
  | 'dip_bars'
  | 'bench_flat'
  | 'bench_incline'
  | 'bench_decline'
  | 'leg_press'
  | 'hack_squat'
  | 'lat_pulldown'
  | 'rowing_machine'
  | 'treadmill'
  | 'stationary_bike'
  | 'elliptical'
  | 'resistance_bands'
  | 'bodyweight'
  | 'ez_curl_bar'
  | 'trap_bar'
  | 'medicine_ball'
  | 'stability_ball'
  | 'foam_roller'
  | 'suspension_trainer'
  | 'battle_ropes'
  | 'plyo_box'
  | 'ab_wheel';

export const EQUIPMENT_LIST: { id: Equipment; label: string; category: 'free_weights' | 'machines' | 'cardio' | 'accessories' | 'bodyweight' }[] = [
  { id: 'barbell', label: 'Barbell', category: 'free_weights' },
  { id: 'dumbbell', label: 'Dumbbell', category: 'free_weights' },
  { id: 'kettlebell', label: 'Kettlebell', category: 'free_weights' },
  { id: 'ez_curl_bar', label: 'EZ Curl Bar', category: 'free_weights' },
  { id: 'trap_bar', label: 'Trap Bar', category: 'free_weights' },
  { id: 'cable_machine', label: 'Cable Machine', category: 'machines' },
  { id: 'smith_machine', label: 'Smith Machine', category: 'machines' },
  { id: 'leg_press', label: 'Leg Press Machine', category: 'machines' },
  { id: 'hack_squat', label: 'Hack Squat Machine', category: 'machines' },
  { id: 'lat_pulldown', label: 'Lat Pulldown Machine', category: 'machines' },
  { id: 'rowing_machine', label: 'Rowing Machine', category: 'cardio' },
  { id: 'treadmill', label: 'Treadmill', category: 'cardio' },
  { id: 'stationary_bike', label: 'Stationary Bike', category: 'cardio' },
  { id: 'elliptical', label: 'Elliptical', category: 'cardio' },
  { id: 'bench_flat', label: 'Flat Bench', category: 'accessories' },
  { id: 'bench_incline', label: 'Incline Bench', category: 'accessories' },
  { id: 'bench_decline', label: 'Decline Bench', category: 'accessories' },
  { id: 'resistance_bands', label: 'Resistance Bands', category: 'accessories' },
  { id: 'medicine_ball', label: 'Medicine Ball', category: 'accessories' },
  { id: 'stability_ball', label: 'Stability Ball', category: 'accessories' },
  { id: 'foam_roller', label: 'Foam Roller', category: 'accessories' },
  { id: 'suspension_trainer', label: 'Suspension Trainer', category: 'accessories' },
  { id: 'battle_ropes', label: 'Battle Ropes', category: 'accessories' },
  { id: 'plyo_box', label: 'Plyo Box', category: 'accessories' },
  { id: 'ab_wheel', label: 'Ab Wheel', category: 'accessories' },
  { id: 'bodyweight', label: 'Bodyweight', category: 'bodyweight' },
  { id: 'pull_up_bar', label: 'Pull-up Bar', category: 'bodyweight' },
  { id: 'dip_bars', label: 'Dip Bars', category: 'bodyweight' },
];
