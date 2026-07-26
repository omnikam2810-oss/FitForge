import { TextStyle } from 'react-native';

export const fonts = {
  outfit: 'Outfit_600SemiBold',
  inter: 'Inter_400Regular',
};

export const typography = {
  h1: {
    fontFamily: fonts.outfit,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  } as TextStyle,
  h2: {
    fontFamily: fonts.outfit,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  } as TextStyle,
  h3: {
    fontFamily: fonts.outfit,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  } as TextStyle,
  body: {
    fontFamily: fonts.inter,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,
  bodySmall: {
    fontFamily: fonts.inter,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,
  caption: {
    fontFamily: fonts.inter,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  } as TextStyle,
  button: {
    fontFamily: fonts.inter,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  } as TextStyle,
  label: {
    fontFamily: fonts.inter,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  } as TextStyle,
  stat: {
    fontFamily: fonts.outfit,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
  } as TextStyle,
};
