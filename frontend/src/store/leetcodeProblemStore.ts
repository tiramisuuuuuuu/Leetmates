import { create } from "zustand";

interface LeetCodeProblemState {
  currentProblem: string | null;
  setCurrentProblem: (problem: string) => void;
}

export const useLCProblem = create<LeetCodeProblemState>((set) => ({
  currentProblem: null,
  setCurrentProblem: (currentProblem) => set({ currentProblem }),
}));
