import api from './api';

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: any;
}

export const messageService = {
  sendMessage: async (data: { matchId: string; content: string }) => {
    const response = await api.post('/messages', data);
    return response.data;
  },

  getMessages: async (matchId: string) => {
    const response = await api.get(`/messages/match/${matchId}`);
    return response.data;
  },
};

