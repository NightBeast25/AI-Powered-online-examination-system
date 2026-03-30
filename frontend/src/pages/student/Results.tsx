import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../api/config';
import { Loader } from '../../components/ui/Loader';
import { Trophy } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';

export const Results = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    api.get(`/analytics/result/${resultId}`).then(res => setResult(res.data)).catch(console.error);
  }, [resultId]);

  if (!result) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

  const topicsData = result.topic_breakdown?.topics || [];
  
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy size={40} />
        </div>
        <h1 className="text-4xl font-extrabold mb-4 animate-slide-up">Exam Completed!</h1>
        <p className="text-textMuted text-lg">Detailed performance report. Certificate Hash: <code className="text-xs bg-surface p-1 rounded font-mono break-all text-primary/80">{result.result_hash}</code></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center border-t-4 border-t-secondary bg-surface/50 backdrop-blur-md">
          <div className="text-textMuted mb-2 font-medium flex items-center justify-center gap-2">Final Grade</div>
          <div className="text-5xl font-extrabold text-secondary drop-shadow-sm flex items-center justify-center gap-2">
            {result.grade} {['A+', 'A'].includes(result.grade) && <span className="text-4xl animate-bounce">🔥</span>}
          </div>
        </Card>
        
        <Card className="p-6 text-center border-t-4 border-t-success bg-surface/50 backdrop-blur-md">
          <div className="text-textMuted mb-2 font-medium flex items-center justify-center gap-2">Percentage</div>
          <div className="text-5xl font-extrabold text-success drop-shadow-sm">{result.percentage.toFixed(1)}%</div>
          <div className="text-xs text-textMuted mt-2">Overall Accuracy</div>
        </Card>
        
        <Card className="p-6 text-center border-t-4 border-t-primary bg-surface/50 backdrop-blur-md">
          <div className="text-textMuted mb-2 font-medium flex items-center justify-center gap-2">Correct Answers</div>
          <div className="text-5xl font-extrabold text-primary drop-shadow-sm">{result.topic_breakdown?.correct_answers || 0}</div>
          <div className="text-xs text-textMuted mt-2">out of {result.topic_breakdown?.total_questions || 0} total</div>
        </Card>

        <Card className="p-6 text-center border-t-4 border-t-warning bg-surface/50 backdrop-blur-md">
          <div className="text-textMuted mb-2 font-medium flex items-center justify-center gap-2">Adaptive Theta</div>
          <div className="text-5xl font-extrabold text-warning drop-shadow-sm">{result.theta_score.toFixed(2)}</div>
          <div className="text-xs text-textMuted mt-2">True Ability Estimate</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-6 h-[400px] flex flex-col">
          <h3 className="font-semibold text-lg mb-6">Topic Strength Radar</h3>
          <div className="flex-1 min-h-0">
            {topicsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={topicsData}>
                  <PolarGrid stroke="#E4E8F0" />
                  <PolarAngleAxis dataKey="topic" tick={{ fill: '#8A94A6', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Accuracy" dataKey="accuracy" stroke="#4F6AF5" fill="#4F6AF5" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-textMuted">No topic data available</div>
            )}
          </div>
        </Card>
        
        <Card className="p-6 h-[400px] flex flex-col">
          <h3 className="font-semibold text-lg mb-6">Time Per Topic Breakdown</h3>
          <div className="flex-1 min-h-0">
             {topicsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicsData} layout="vertical" margin={{ left: 40, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="topic" type="category" axisLine={false} tickLine={false} tick={{ fill: '#8A94A6', fontSize: 12 }} />
                  <Tooltip cursor={{fill: '#f8f9fc'}}/>
                  <Bar dataKey="avg_time" fill="#7C3AED" radius={[0, 4, 4, 0]} name="Avg Secs" />
                </BarChart>
              </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-textMuted">No topic data available</div>
            )}
          </div>
        </Card>
      </div>

      <div className="text-center">
        <Link to="/dashboard">
          <Button size="lg" variant="outline">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};
