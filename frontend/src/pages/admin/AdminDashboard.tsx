import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { getDashboardStats, getStudentPerformance, getAllStudents, deleteStudent, deleteResult } from '../../api/admin';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export const AdminDashboard = () => {
  const user = useAuthStore(s => s.user);
  const [stats, setStats] = useState<any>(null);
  const [performances, setPerformances] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const loadData = () => {
    getDashboardStats().then(data => setStats(data.stats)).catch(() => toast.error('Failed to load stats'));
    getStudentPerformance().then(data => setPerformances(data)).catch(() => toast.error('Failed to load performance metrics'));
    getAllStudents().then(data => setStudents(data)).catch(() => toast.error('Failed to load registered students'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteStudent = async (id: number) => {
    if (!window.confirm('Are you sure you want to completely delete this student? This action cannot be undone.')) return;
    try {
      await deleteStudent(id);
      toast.success('Student deleted completely from portal');
      loadData();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const handleDeleteResult = async (id: number) => {
    if (!window.confirm('Are you certain you want to delete this result? The student will be allowed to retake the test.')) return;
    try {
      await deleteResult(id);
      toast.success('Exam result deleted successfully');
      loadData();
    } catch (err) {
      toast.error('Failed to delete result');
    }
  };

  return (
    <div className="p-8 space-y-10 max-w-[1400px] mx-auto min-h-screen bg-background text-textPrimary">
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
            👑 Command Center
          </h1>
          <p className="text-sm font-medium text-textMuted mt-2 uppercase tracking-widest">{new Date().toLocaleDateString()} | Welcome back, <span className="text-primary">{user?.name || 'Director'}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 border-l-4 border-l-primary bg-surface/80 backdrop-blur shadow-xl hover:shadow-primary/10 transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider">Total Exams Active</h3>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-5xl font-black">{stats?.total_exams || 0}</p>
        </Card>
        
        <Card className="p-8 border-l-4 border-l-secondary bg-surface/80 backdrop-blur shadow-xl hover:shadow-secondary/10 transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider">Total Students</h3>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-5xl font-black text-secondary">{stats?.total_students || 0}</p>
        </Card>
        
        <Card className="p-8 border-l-4 border-l-warning bg-surface/80 backdrop-blur shadow-xl hover:shadow-warning/10 transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider">Tests Completed</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-5xl font-black">{stats?.total_tests_taken || 0}</p>
        </Card>
      </div>

      <Card className="border border-border/40 bg-surface/40 backdrop-blur-md rounded-2xl overflow-hidden mt-8 shadow-lg">
        <div className="p-8 border-b border-border/40 flex justify-between items-center bg-surface w-full">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">👥 Global Student Directory</h2>
            <p className="text-sm font-medium text-textMuted mt-1">Full administrative control over registered users.</p>
          </div>
          <div className="px-5 py-2 bg-primary/20 text-primary border border-primary/30 rounded-xl text-sm font-extrabold uppercase tracking-wide shadow-sm">
            {students.length} Registered Nodes
          </div>
        </div>
        
        {students.length === 0 ? (
          <div className="p-12 text-center text-textMuted">
            No students registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left">
              <thead className="bg-background/50 sticky top-0">
                <tr>
                  <th className="py-3 px-6 font-semibold text-sm">ID</th>
                  <th className="py-3 px-6 font-semibold text-sm">Name</th>
                  <th className="py-3 px-6 font-semibold text-sm">Email</th>
                  <th className="py-3 px-6 font-semibold text-sm">Registered Date</th>
                  <th className="py-3 px-6 font-semibold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(row => (
                  <tr key={row.student_id} className="border-b border-border hover:bg-background/50 transition-colors">
                    <td className="py-3 px-6 font-mono text-sm">#{row.student_id}</td>
                    <td className="py-3 px-6 font-medium">{row.name}</td>
                    <td className="py-3 px-6 text-textMuted">{row.email}</td>
                    <td className="py-3 px-6 text-sm text-textMuted">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <button onClick={() => handleDeleteStudent(row.student_id)} className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors">
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

      <Card className="border border-border bg-surface rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Student Performance Board</h2>
          <p className="text-sm text-textMuted">Live view of every completed exam session.</p>
        </div>
        
        {performances.length === 0 ? (
          <div className="p-12 text-center text-textMuted">
            No students have completed an exam yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background/50">
                <tr>
                  <th className="py-3 px-6 font-semibold text-sm">Student</th>
                  <th className="py-3 px-6 font-semibold text-sm">Exam Taken</th>
                  <th className="py-3 px-6 font-semibold text-sm">Theta Score</th>
                  <th className="py-3 px-6 font-semibold text-sm">Percentage</th>
                  <th className="py-3 px-6 font-semibold text-sm">Grade</th>
                  <th className="py-3 px-6 font-semibold text-sm">Date</th>
                  <th className="py-3 px-6 font-semibold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {performances.map(row => (
                  <tr key={row.result_id} className="border-b border-border hover:bg-background/50 transition-colors">
                    <td className="py-3 px-6">
                      <div className="font-medium">{row.student_name}</div>
                      <div className="text-xs text-textMuted">{row.student_email}</div>
                    </td>
                    <td className="py-3 px-6 font-medium">{row.exam_title}</td>
                    <td className="py-3 px-6">
                      <div className="font-mono">{row.theta_score.toFixed(2)}</div>
                    </td>
                    <td className="py-3 px-6">{Math.round(row.percentage)}%</td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        ['A+','A','B'].includes(row.grade) ? 'bg-green-500/20 text-green-400' : 
                        row.grade === 'C' ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm text-textMuted">
                      {new Date(row.date).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <button 
                        title="Delete Exam Attempt"
                        onClick={() => handleDeleteResult(row.result_id)}
                        className="p-2 bg-danger/10 text-danger border border-danger/20 rounded-lg hover:bg-danger hover:text-white transition-all transform hover:scale-105"
                      >
                        <Trash2 size={16} />
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
  );
};
