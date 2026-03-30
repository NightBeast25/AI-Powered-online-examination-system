import { api } from './config';
import { Exam } from '../types';

export const listExams = async () => {
  const res = await api.get('/exam/list');
  return res.data as Exam[];
};

export const startExam = async (exam_id: number) => {
  const res = await api.post('/exam/start', { exam_id });
  return res.data;
};

export const submitAnswer = async (data: any) => {
  const res = await api.post('/exam/submit-answer', data);
  return res.data;
};

export const endExam = async (session_id: number) => {
  const res = await api.post(`/exam/end?session_id=${session_id}`);
  return res.data;
};
export const checkAttemptStatus = async (exam_id: number) => {
  const res = await api.get(`/exam/attempt-status/${exam_id}`);
  return res.data;
};
