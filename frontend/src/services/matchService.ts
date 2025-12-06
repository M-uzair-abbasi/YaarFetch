import api from './api';

export interface Match {
  id: string;
  orderId: string;
  offerId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  matchedAt?: string;
  completedAt?: string;
  order?: any;
  offer?: any;
}

export const matchService = {
  createMatch: async (data: { orderId: string; offerId: string }) => {
    const response = await api.post('/matches', data);
    return response.data;
  },

  getMatches: async () => {
    const response = await api.get('/matches');
    return response.data;
  },

  getMatch: async (id: string) => {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },

  getMatchesForOrder: async (orderId: string) => {
    const response = await api.get(`/matches/order/${orderId}`);
    return response.data;
  },

  getMatchesForOffer: async (offerId: string) => {
    const response = await api.get(`/matches/offer/${offerId}`);
    return response.data;
  },

  updateMatchStatus: async (id: string, status: string) => {
    const response = await api.put(`/matches/${id}/status`, { status });
    return response.data;
  },
};

