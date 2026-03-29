export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface Exam {
  exam_id: number;
  title: string;
  subject: string;
  total_questions: number;
  time_limit_mins: number;
}

export interface Question {
  question_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
}
