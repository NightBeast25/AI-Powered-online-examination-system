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

      <Card className="p-8 mb-12 bg-surface/80 backdrop-blur border border-border/50 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">📊 Detailed Question Analysis</h2>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            ⏱️ Total Time: {result.detailed_responses?.reduce((acc: number, r: any) => acc + r.time_taken_secs, 0) || 0}s
          </div>
        </div>
        
        <div className="overflow-x-auto rounded-xl border border-border/40">
          <table className="w-full text-left">
            <thead className="bg-background/80 text-textMuted text-sm font-semibold sticky top-0">
              <tr>
                <th className="py-4 px-6">Q#</th>
                <th className="py-4 px-6">Question Preview</th>
                <th className="py-4 px-6">Your Option</th>
                <th className="py-4 px-6 text-center">Time Spent</th>
                <th className="py-4 px-6 text-center">Result</th>
                <th className="py-4 px-6 text-right">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {result.detailed_responses?.map((r: any) => (
                <tr key={r.order} className="hover:bg-background/40 transition-colors">
                  <td className="py-4 px-6 font-mono text-textMuted">{r.order}</td>
                  <td className="py-4 px-6 font-medium max-w-xs truncate" title={r.question_text}>
                    {r.question_text}
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-center">
                    <span className="bg-surface border border-border/60 rounded px-2 py-1">{r.selected_option}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-textMuted">
                      ⏱️ {r.time_taken_secs}s
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-xl">
                    {r.is_correct ? '✅' : '❌'}
                  </td>
                  <td className="py-4 px-6 text-right text-xs font-mono text-textMuted">
                    {r.difficulty.toFixed(2)}
                  </td>
                </tr>
              ))}
              {(!result.detailed_responses || result.detailed_responses.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-textMuted">No detailed response telemetry available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-center">
        <Link to="/dashboard">
          <Button size="lg" variant="outline">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};
