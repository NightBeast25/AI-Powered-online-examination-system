import { create } from 'zustand';

interface BehaviorState {
  flags: string[];
  addFlag: (flag: string) => void;
}

export const useBehaviorStore = create<BehaviorState>((set) => ({
  flags: [],
  addFlag: (flag) => set((state) => ({ flags: [...state.flags, flag] }))
}));
