import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { api } from '../../api/config';
import { Trophy, TrendingUp, BookOpen, Clock } from 'lucide-react';
import { Loader } from '../../components/ui/Loader';
import { Link } from 'react-router-dom';

export const Performance = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/history')
      .then(res => {
        setHistory(res.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Performance</h1>
        <p className="text-textMuted">View your past exam results and overall academic standing.</p>
      </div>

      {history.length === 0 ? (
        <Card className="p-12 text-center border border-border bg-surface">
          <Trophy className="mx-auto h-12 w-12 text-textMuted mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">No Results Yet</h2>
          <p className="text-textMuted mb-6">Complete an exam to see your performance metrics here.</p>
          <Link to="/dashboard" className="text-primary hover:underline font-medium">Browse Available Exams &rarr;</Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((result: any) => (
            <Card key={result.result_id} hoverable>
              <Link to={`/results/${result.result_id}`} className="block p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp size={24} />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    result.grade === 'A+' || result.grade === 'A' ? 'bg-success/20 text-success' :
                    result.grade === 'B' || result.grade === 'C' ? 'bg-primary/20 text-primary' :
                    result.grade === 'D' ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'
                  }`}>
                    Grade: {result.grade}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">Exam Result #{result.result_id}</h3>
                
                <div className="space-y-2 mt-4 text-sm text-textMuted">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><BookOpen size={16}/> Theta Score</span>
                    <span className="font-medium text-textPrimary">{result.theta_score.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Trophy size={16}/> Percentage</span>
                    <span className="font-medium text-textPrimary">{result.percentage?.toFixed(1) || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Clock size={16}/> Date Taken</span>
                    <span className="font-medium text-textPrimary">{new Date(result.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
