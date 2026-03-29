import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { admin_register_user } from '../../api/auth';
import toast from 'react-hot-toast';

export const AdminRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await admin_register_user({ name, email, password });
      toast.success('Admin Registration successful. Please login.');
      navigate('/login');
    } catch (err) {
      toast.error('Admin Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 bg-surface border border-primary/20">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
            A
          </div>
          <h1 className="text-2xl font-bold text-primary">Admin Registration</h1>
          <p className="text-sm text-textMuted mt-2">Create an administrative account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
              required
            />
          </div>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Submit Secure Registration
          </Button>
        </form>
        <p className="text-center mt-6 text-sm text-textMuted">
          Want a student account? <Link to="/register" className="text-primary hover:underline">Student Sign Up</Link>
        </p>
      </Card>
    </div>
  );
};
