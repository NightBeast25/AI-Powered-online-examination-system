import { useState, useCallback } from 'react';
import { submitAnswer, endExam } from '../api/exam';
import { useExamStore } from '../store/examStore';
import { useNavigate } from 'react-router-dom';

export const useAdaptiveExam = () => {
  const { sessionId, updateTheta, incrementQuestion } = useExamStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleAnswerSubmit = useCallback(async (questionId: number, selectedOption: string, timeSpent: number) => {
    if (!sessionId || isSubmitting) return null;
    
    setIsSubmitting(true);
    try {
      const res = await submitAnswer({
        session_id: sessionId,
        question_id: questionId,
        selected_option: selectedOption,
        time_taken_secs: timeSpent
      });
      
      updateTheta(res.theta_after);
      incrementQuestion();
      setIsSubmitting(false);
      return res;
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      return null;
    }
  }, [sessionId, isSubmitting, updateTheta, incrementQuestion]);

  const handleEndExam = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await endExam(sessionId);
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(console.error);
      }
      navigate(`/results/${res.result_id}`);
    } catch (error) {
      console.error("Failed to end exam", error);
    }
  }, [sessionId, navigate]);

  return {
    handleAnswerSubmit,
    handleEndExam,
    isSubmitting
  };
};
