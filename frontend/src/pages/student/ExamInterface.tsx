import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useExamStore } from '../../store/examStore';
import { useTimer } from '../../hooks/useTimer';
import { useAntiCheat } from '../../hooks/useAntiCheat';
import { useAdaptiveExam } from '../../hooks/useAdaptiveExam';
import { QuestionCard } from '../../components/exam/QuestionCard';
import { TimerBar } from '../../components/exam/TimerBar';
import { DifficultyMeter } from '../../components/exam/DifficultyMeter';
import { ThetaGraph } from '../../components/exam/ThetaGraph';
import { Loader } from '../../components/ui/Loader';

export const ExamInterface = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<any>(location.state?.next_question || null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [thetaHistory, setThetaHistory] = useState<number[]>([0.0]);
  
  const { questionNumber } = useExamStore();
  const { handleAnswerSubmit, handleEndExam, isSubmitting } = useAdaptiveExam();
  
  useAntiCheat();

  const handleTimeExpire = () => {
    handleEndExam();
  };
  
  const timer = useTimer(30, handleTimeExpire); // 30 minutes

  const onSubmit = async (selectedOption: string) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const res = await handleAnswerSubmit(question.question_id, selectedOption, timeSpent);
    
    if (res) {
      setThetaHistory(prev => [...prev, res.theta_after]);
      if (res.next_question) {
        setQuestion(res.next_question);
        setStartTime(Date.now());
      } else {
        handleEndExam();
      }
    }
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <Loader />
        <p className="text-textMuted">Loading exam questions...</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="text-primary hover:underline text-sm mt-4"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-none">
      <TimerBar progress={timer.progress} minutes={timer.minutes} seconds={timer.seconds} />
      
      <div className="fixed left-6 top-24 hidden lg:block">
        <DifficultyMeter difficultyLevel={question.difficulty_level} />
      </div>
      
      <div className="fixed right-6 bottom-6 hidden lg:block z-10">
        <ThetaGraph history={thetaHistory} />
      </div>

      <main className="pt-24 pb-24 px-4 h-screen overflow-y-auto">
        <div className="max-w-3xl mx-auto rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-primary text-2xl">🎯</span> 
              Question {questionNumber} of {useExamStore.getState().totalQuestions}
            </h2>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(questionNumber / (useExamStore.getState().totalQuestions || 10)) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-textMuted ml-2">{Math.round((questionNumber / (useExamStore.getState().totalQuestions || 10)) * 100)}%</span>
            </div>
          </div>
          
          <div className="bg-surface/50 p-1 rounded-2xl mb-4 border border-border shadow-sm">
            {isSubmitting ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3">
                <Loader />
                <span className="text-textMuted text-sm animate-pulse">Calculating adaptive difficulty... ✨</span>
              </div>
            ) : (
              <QuestionCard
                question={question}
                questionNumber={questionNumber}
                onSubmit={onSubmit}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
