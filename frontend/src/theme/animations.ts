import { withSpring, withTiming, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

const defaultSpringConfig = {
  damping: 10,
  stiffness: 100,
  mass: 1,
};

const defaultTimingConfig = {
  duration: 250,
};

export const animations = {
  spring: (value: number, config?: WithSpringConfig) => {
    'worklet';
    return (withSpring as unknown as (value: number, config: Record<string, unknown>) => number)(value, {
      ...(defaultSpringConfig as Record<string, unknown>),
      ...(config as Record<string, unknown> | undefined),
    });
  },
  timing: (value: number, config?: WithTimingConfig) => {
    'worklet';
    return (withTiming as unknown as (value: number, config: Record<string, unknown>) => number)(value, {
      ...(defaultTimingConfig as Record<string, unknown>),
      ...(config as Record<string, unknown> | undefined),
    });
  },
};
