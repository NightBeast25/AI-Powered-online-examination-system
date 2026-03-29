import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { PageWrapper } from './components/layout/PageWrapper';
import { useAuthStore } from './store/authStore';

// Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { AdminRegister } from './pages/auth/AdminRegister';
import { Dashboard } from './pages/student/Dashboard';
import { ExamLobby } from './pages/student/ExamLobby';
import { ExamInterface } from './pages/student/ExamInterface';
import { Results } from './pages/student/Results';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { QuestionBank } from './pages/admin/QuestionBank';
import { ExamManager } from './pages/admin/ExamManager';

// Layout with sidebar for normal pages
const DashboardLayout = ({ role }: { role?: 'student' | 'admin' }) => {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={user.role} />
        <main className="flex-1 w-full overflow-y-auto bg-background">
          <PageWrapper>
            <Outlet />
          </PageWrapper>
        </main>
      </div>
    </div>
  );
};

// Minimal auth guard — no sidebar/navbar (for fullscreen exam)
const AuthOnly = () => {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right"
        toastOptions={{
          style: {
            background: '#2B2E36',
            color: '#fff',
            borderRadius: '12px',
          },
        }} 
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* Fullscreen exam — auth required but no chrome */}
        <Route element={<AuthOnly />}>
          <Route path="/exam/:session_id" element={<ExamInterface />} />
        </Route>

        {/* Student Routes */}
        <Route element={<DashboardLayout role="student" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lobby/:examId" element={<ExamLobby />} />
          <Route path="/results/:resultId" element={<Results />} />
          <Route path="/exams" element={<Navigate to="/dashboard" />} />
          <Route path="/analytics" element={<Navigate to="/dashboard" />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<DashboardLayout role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/questions" element={<QuestionBank />} />
          <Route path="/admin/exams" element={<ExamManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
