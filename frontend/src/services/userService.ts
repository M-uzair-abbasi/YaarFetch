import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profilePic?: string;
  campus?: string;
  rolePreference: 'BUYER' | 'DELIVERER' | 'BOTH';
  rating: number;
  emailVerified: boolean;
}

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  uploadProfilePic: async (file: File) => {
    const formData = new FormData();
    formData.append('profilePic', file);
    const response = await api.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

