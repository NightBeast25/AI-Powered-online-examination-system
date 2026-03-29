import { api } from './config';
import { User } from '../types';

export const login = async (data: any) => {
  const formData = new URLSearchParams();
  formData.append('username', data.email);
  formData.append('password', data.password);
  
  const res = await api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return res.data;
};

export const register_user = async (data: any) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const admin_register_user = async (data: any) => {
  const res = await api.post('/auth/admin-register', data);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data as User;
};
