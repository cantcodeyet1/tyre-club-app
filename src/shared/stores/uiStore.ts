import { create } from 'zustand';

type UiState = {
  healthFilter: 'all' | 'compliance' | 'service' | 'reports';
  tripFilter: 'upcoming' | 'past';
  wizardStep: number;
  setHealthFilter: (filter: UiState['healthFilter']) => void;
  setTripFilter: (filter: UiState['tripFilter']) => void;
  setWizardStep: (step: number) => void;
};

export const useUiStore = create<UiState>((set) => ({
  healthFilter: 'all',
  tripFilter: 'upcoming',
  wizardStep: 1,
  setHealthFilter: (healthFilter) => set({ healthFilter }),
  setTripFilter: (tripFilter) => set({ tripFilter }),
  setWizardStep: (wizardStep) => set({ wizardStep }),
}));
