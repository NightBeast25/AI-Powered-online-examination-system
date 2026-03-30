import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { login, getMe } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.login);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { access_token } = await login({ email, password });
      localStorage.setItem('token', access_token);
      const user = await getMe();
      setAuth(access_token, user);
      
      toast.success('Welcome back!');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Is the backend running?');
      } else {
        toast.error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
            A
          </div>
          <h1 className="text-2xl font-bold">Sign in to AdaptiveExam</h1>
          <p className="text-textMuted mt-2">Enter your details below</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-textPrimary placeholder:text-textMuted/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-textPrimary placeholder:text-textMuted/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
              required
            />
          </div>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-textMuted">
            Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Register as Student</Link>
          </p>
          <p className="text-xs text-textMuted/60">
            Are you a Teacher/Admin? <Link to="/admin-register" className="text-primary/80 hover:underline">Create an Admin Account</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
