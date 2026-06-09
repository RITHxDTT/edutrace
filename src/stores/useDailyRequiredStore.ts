import { create } from "zustand";

export type DailyRequiredAssessment = {
  assessmentId: string;
  title: string;
};

interface DailyRequiredStore {
  assessments: DailyRequiredAssessment[];
  /** Increment to tell the provider to re-fetch immediately */
  refreshCounter: number;
  setAssessments: (items: DailyRequiredAssessment[]) => void;
  refresh: () => void;
  clear: () => void;
}

export const useDailyRequiredStore = create<DailyRequiredStore>((set) => ({
  assessments: [],
  refreshCounter: 0,
  setAssessments: (items) => set({ assessments: items }),
  refresh: () => set((s) => ({ refreshCounter: s.refreshCounter + 1 })),
  clear: () => set({ assessments: [] }),
}));
