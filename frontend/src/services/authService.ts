import api from './api';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  campus?: string;
  rolePreference?: 'BUYER' | 'DELIVERER' | 'BOTH';
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.get('/auth/verify-email', { params: { token } });
    return response.data;
  },
};

