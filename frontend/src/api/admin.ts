import { api } from './config';

export const getDashboardStats = async () => {
  const res = await api.get('/admin/dashboard');
  return res.data;
};

export const getExams = async () => {
  const res = await api.get('/admin/exams');
  return res.data;
};

export const createExam = async (examData: any) => {
  const res = await api.post('/admin/exams', examData);
  return res.data;
};

export const createQuestion = async (questionData: any) => {
  const res = await api.post('/admin/questions', questionData);
  return res.data;
};

export const getStudentPerformance = async () => {
  const res = await api.get('/admin/performance');
  return res.data;
};

export const getAllStudents = async () => {
  const res = await api.get('/admin/students');
  return res.data;
};

export const getAllQuestions = async () => {
  const res = await api.get('/admin/questions');
  return res.data;
};

export const deleteExam = async (examId: number) => {
  const res = await api.delete(`/admin/exams/${examId}`);
  return res.data;
};

export const deleteQuestion = async (questionId: number) => {
  const res = await api.delete(`/admin/questions/${questionId}`);
  return res.data;
};

export const deleteStudent = async (studentId: number) => {
  const res = await api.delete(`/admin/students/${studentId}`);
  return res.data;
};
