import { create } from 'zustand';

interface ExamState {
  sessionId: number | null;
  currentTheta: number;
  questionNumber: number;
  setSession: (id: number) => void;
  updateTheta: (theta: number) => void;
  incrementQuestion: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
  sessionId: null,
  currentTheta: 0,
  questionNumber: 1,
  setSession: (id) => set({ sessionId: id, currentTheta: 0, questionNumber: 1 }),
  updateTheta: (theta) => set({ currentTheta: theta }),
  incrementQuestion: () => set((state) => ({ questionNumber: state.questionNumber + 1 }))
}));
