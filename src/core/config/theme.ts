import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const lightColors = {
  primary: '#E53E3E',
  background: '#FFFFFF',
  card: '#F7F7F7',
  text: '#1A202C',
  border: '#E2E8F0',
  notification: '#E53E3E',
  surface: '#FFFFFF',
  onSurface: '#1A202C',
  accent: '#4299E1',
  error: '#F56565',
  success: '#48BB78',
};

const darkColors = {
  primary: '#FC8181',
  background: '#1A202C',
  card: '#2D3748',
  text: '#F7FAFC',
  border: '#4A5568',
  notification: '#FC8181',
  surface: '#2D3748',
  onSurface: '#F7FAFC',
  accent: '#63B3ED',
  error: '#FEB2B2',
  success: '#68D391',
};

export const theme = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...lightColors,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      ...darkColors,
    },
  },
};