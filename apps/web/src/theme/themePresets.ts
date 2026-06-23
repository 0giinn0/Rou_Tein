export interface ThemePreset {
  id: string;
  name: string;
  category: 'Dark' | 'Light';
  preview: string;
  bg: string;
  surface: string;
  surfaceVariant: string;
  card: string;
  border: string;
  primary: string;
  onBg: string;
  onSurface: string;
  muted: string;
  subtle: string;
  green: string;
  error: string;
  gradientStart: string;
  gradientEnd: string;
}

export const themePresets: ThemePreset[] = [
  {
    id: 'black_white',
    name: 'Black & White',
    category: 'Dark',
    preview: '#FFFFFF',
    bg: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceVariant: '#2A2A2A',
    card: '#141414',
    border: '#444444',
    primary: '#FFFFFF',
    onBg: '#FFFFFF',
    onSurface: '#FFFFFF',
    muted: '#888888',
    subtle: '#555555',
    green: '#FFFFFF',
    error: '#FFFFFF',
    gradientStart: '#141414',
    gradientEnd: '#0A0A0A',
  },
];
