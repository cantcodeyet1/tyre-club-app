import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DistanceUnit = 'km' | 'mi';
export type LandingScreen = 'home' | 'vehicles' | 'health';

type SettingsState = {
  distanceUnit: DistanceUnit;
  landingScreen: LandingScreen;
  setDistanceUnit: (unit: DistanceUnit) => void;
  setLandingScreen: (screen: LandingScreen) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      distanceUnit: 'km',
      landingScreen: 'home',
      setDistanceUnit: (distanceUnit) => set({ distanceUnit }),
      setLandingScreen: (landingScreen) => set({ landingScreen }),
    }),
    { name: 'tyre-club-settings' },
  ),
);
