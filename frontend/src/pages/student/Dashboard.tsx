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
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-secondary/20 blur-3xl rounded-full"></div>
        <h1 className="text-4xl font-extrabold tracking-tight relative z-10">Welcome back, {user?.name.split(' ')[0]} <span className="animate-bounce inline-block origin-bottom">👋</span></h1>
        <p className="text-textMuted mt-2 relative z-10 text-lg">Ready to conquer your next examination? 🔥</p>
      </div>
      
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Target className="text-primary w-6 h-6" />
          <h2 className="text-2xl font-bold">Available Exams</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map(exam => (
            <Card key={exam.exam_id} hoverable onClick={() => navigate(`/lobby/${exam.exam_id}`)} className="group border border-border/50 bg-surface/40 backdrop-blur-sm">
              <div className="p-6 relative">
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    Start <Target size={12} />
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center mb-5 shadow-lg shadow-primary/20">
                  <BookOpen size={24} />
                </div>
                <h3 className="font-bold text-2xl mb-1 text-textPrimary group-hover:text-primary transition-colors">{exam.title}</h3>
                <p className="text-textMuted text-sm mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse"></span> {exam.subject}
                </p>
                
                <div className="flex items-center gap-4 text-sm font-medium bg-background/50 p-3 rounded-xl border border-border/30">
                  <div className="flex items-center gap-2 text-primary">
                    <Clock size={16} />
                    <span>{exam.time_limit_mins} mins</span>
                  </div>
                  <div className="w-px h-4 bg-border"></div>
                  <div className="flex items-center gap-2 text-secondary">
                    <Target size={16} />
                    <span>{exam.total_questions} Qs</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {exams.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/50 rounded-2xl bg-surface/20">
               <div className="text-6xl mb-4 opacity-50">😴</div>
               <h3 className="text-xl font-bold text-textMuted">No exams available</h3>
               <p className="text-textMuted/60 mt-2">Take a break, you've earned it!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
