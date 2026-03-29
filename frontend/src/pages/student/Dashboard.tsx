import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { listExams } from '../../api/exam';
import { useAuthStore } from '../../store/authStore';
import { BookOpen, Clock, Target } from 'lucide-react';

export const Dashboard = () => {
  const [exams, setExams] = useState<any[]>([]);
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    listExams().then(setExams).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Exams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map(exam => (
            <Card key={exam.exam_id} hoverable onClick={() => navigate(`/lobby/${exam.exam_id}`)}>
              <div className="p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-semibold text-xl mb-1">{exam.title}</h3>
                <p className="text-textMuted text-sm mb-4">{exam.subject}</p>
                
                <div className="flex items-center gap-4 text-sm text-textMuted">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{exam.time_limit_mins} mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target size={16} />
                    <span>{exam.total_questions} Qs</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {exams.length === 0 && (
            <div className="col-span-full text-center p-8 border-2 border-dashed border-border rounded-xl text-textMuted">
              No exams available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
