import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { getDashboardStats, getStudentPerformance, getAllStudents, deleteStudent } from '../../api/admin';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

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

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'Admin'}</h1>
        <p className="text-sm text-textMuted">{new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border border-border bg-surface">
          <h3 className="text-sm font-medium text-textMuted mb-2">Total Exams</h3>
          <p className="text-3xl font-bold">{stats?.total_exams || 0}</p>
        </Card>
        <Card className="p-6 border border-border bg-surface">
          <h3 className="text-sm font-medium text-textMuted mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-primary">{stats?.total_students || 0}</p>
        </Card>
        <Card className="p-6 border border-border bg-surface">
          <h3 className="text-sm font-medium text-textMuted mb-2">Tests Taken</h3>
          <p className="text-3xl font-bold">{stats?.total_tests_taken || 0}</p>
        </Card>
      </div>

      <Card className="border border-border bg-surface rounded-xl overflow-hidden mt-8">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Student Directory</h2>
            <p className="text-sm text-textMuted">List of all registered students in the system.</p>
          </div>
          <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {students.length} Registered
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
                  <th className="py-3 px-6 font-semibold text-sm">Percentile</th>
                  <th className="py-3 px-6 font-semibold text-sm">Grade</th>
                  <th className="py-3 px-6 font-semibold text-sm">Date</th>
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
                    <td className="py-3 px-6">{Math.round(row.percentile)}%</td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        ['A','B'].includes(row.grade) ? 'bg-green-500/20 text-green-400' : 
                        row.grade === 'C' ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm text-textMuted">
                      {new Date(row.date).toLocaleString()}
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
