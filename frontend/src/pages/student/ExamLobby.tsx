import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { startExam, checkAttemptStatus } from '../../api/exam';
import { useExamStore } from '../../store/examStore';
import { AlertTriangle, Clock, Target } from 'lucide-react';
import toast from 'react-hot-toast';

export const ExamLobby = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const setSession = useExamStore(s => s.setSession);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    if (examId) {
      checkAttemptStatus(parseInt(examId)).then(data => {
        setHasAttempted(data.attempted);
      }).catch(console.error);
    }
  }, [examId]);
  
  const handleStart = async () => {
    setIsLoading(true);
    try {
      const res = await startExam(parseInt(examId!));
      
      if (!res.next_question) {
        toast.error('No questions available for this exam topic yet. Ask your admin to upload questions.');
        setIsLoading(false);
        return;
      }

      setSession(res.session.session_id, res.session.total_questions || 10);
      
      try {
        await document.documentElement.requestFullscreen();
      } catch (e) {
        console.error("Fullscreen failed");
      }
      
      navigate(`/exam/${res.session.session_id}`, { state: { next_question: res.next_question } });
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.detail || error.message || "Failed to start exam";
      toast.error(`Error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-2">Exam Preparation</h1>
        <p className="text-textMuted mb-8">Please read the instructions carefully before starting.</p>
        
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 mb-8 flex gap-4">
          <AlertTriangle className="text-warning flex-shrink-0" />
          <div className="text-sm">
            <h4 className="font-semibold text-warning">Strict Proctoring Enabled</h4>
            <p className="text-warning/80 mt-1">This exam is continually monitored. Navigating away, switching tabs, or losing window focus will result in penalties or immediate suspension.</p>
          </div>
        </div>

        <ul className="space-y-4 mb-8 text-sm">
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-background flex items-center justify-center text-primary"><Clock size={16} /></div>
            <span>You will have a limited time to complete the test.</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-background flex items-center justify-center text-primary"><Target size={16} /></div>
            <span>The difficulty determines score, not just raw number correct.</span>
          </li>
        </ul>

        {hasAttempted ? (
          <div className="bg-danger/10 border border-danger/30 rounded-xl p-6 text-center">
            <h4 className="font-bold text-danger text-lg mb-2">Access Denied</h4>
            <p className="text-danger/80">You have already attempted this test. Re-attempt is not allowed.</p>
          </div>
        ) : (
          <Button size="lg" className="w-full" onClick={handleStart} isLoading={isLoading}>
            Acknowledge & Start Exam
          </Button>
        )}
      </Card>
    </div>
  );
};
