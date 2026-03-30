import { create } from 'zustand';

interface ExamState {
  sessionId: number | null;
  currentTheta: number;
  questionNumber: number;
  totalQuestions: number;
  setSession: (id: number, totalQs: number) => void;
  updateTheta: (theta: number) => void;
  incrementQuestion: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
  sessionId: null,
  currentTheta: 0,
  questionNumber: 1,
  totalQuestions: 0,
  setSession: (id, totalQs) => set({ sessionId: id, currentTheta: 0, questionNumber: 1, totalQuestions: totalQs }),
  updateTheta: (theta) => set({ currentTheta: theta }),
  incrementQuestion: () => set((state) => ({ questionNumber: Math.min(state.questionNumber + 1, state.totalQuestions || state.questionNumber + 1) }))
}));
