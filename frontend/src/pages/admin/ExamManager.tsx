import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { createExam, getExams, deleteExam } from '../../api/admin';
import toast from 'react-hot-toast';

export const ExamManager = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(30);
  const [passingTheta, setPassingTheta] = useState(0.0);

  const loadExams = async () => {
    try {
      const data = await getExams();
      setExams(data);
    } catch (err) {
      toast.error('Failed to load exams');
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    try {
      await deleteExam(id);
      toast.success('Exam deleted');
      loadExams();
    } catch (err) {
      toast.error('Failed to delete exam');
    }
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createExam({
        title,
        subject,
        total_questions: totalQuestions,
        time_limit_mins: timeLimit,
        passing_theta: passingTheta
      });
      toast.success('Exam created successfully!');
      setTitle('');
      setSubject('');
      loadExams(); // Reload the table
    } catch (err) {
      toast.error('Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Exam Manager</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 col-span-1 border border-border bg-surface">
          <h2 className="text-xl font-semibold mb-4 text-primary">Create New Exam</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                placeholder="Final Semester Exam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                placeholder="Computer Science"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Total Questions</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={totalQuestions}
                  onChange={e => setTotalQuestions(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time (mins)</label>
                <input
                  type="number"
                  min="5"
                  required
                  value={timeLimit}
                  onChange={e => setTimeLimit(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Passing Theta Score</label>
              <input
                type="number"
                step="0.1"
                min="-3.0"
                max="3.0"
                required
                value={passingTheta}
                onChange={e => setPassingTheta(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              />
              <p className="text-xs text-textMuted mt-1">-3.0 (Very Easy) to 3.0 (Very Hard). Typically 0.0.</p>
            </div>
            <Button type="submit" className="w-full" isLoading={loading}>
              Publish Exam
            </Button>
          </form>
        </Card>

        <Card className="p-6 col-span-2 border border-border bg-surface">
          <h2 className="text-xl font-semibold mb-4">Published Exams</h2>
          {exams.length === 0 ? (
            <div className="text-center py-12 text-textMuted">No exams published yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 px-4 font-semibold">ID</th>
                    <th className="pb-3 px-4 font-semibold">Title</th>
                    <th className="pb-3 px-4 font-semibold">Subject</th>
                    <th className="pb-3 px-4 font-semibold">Qs/Time</th>
                    <th className="pb-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map(exam => (
                    <tr key={exam.exam_id} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                      <td className="py-3 px-4">#{exam.exam_id}</td>
                      <td className="py-3 px-4 font-medium">{exam.title}</td>
                      <td className="py-3 px-4 text-textMuted">{exam.subject}</td>
                      <td className="py-3 px-4">{exam.total_questions} Q / {exam.time_limit_mins}m</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => handleDelete(exam.exam_id)} className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
