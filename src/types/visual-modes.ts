export type ColorBlindnessType =
  | 'none'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';

export type DarkThemeMode = 'disabled' | 'native' | 'simulated';

export interface GridConfig {
  columns: 4 | 8 | 12 | 16;
  gutter: number; // in px
  margin: number; // in px
  color: string;  // e.g. '#6366f1'
  opacity: number;// 0.05 to 0.4
}

export interface VisualModesState {
  xrayEnabled: boolean;
  gridEnabled: boolean;
  gridConfig: GridConfig;
  darkThemeMode: DarkThemeMode;
  colorBlindness: ColorBlindnessType;
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
  columns: 12,
  gutter: 20,
  margin: 32,
  color: '#6366f1',
  opacity: 0.15,
};
