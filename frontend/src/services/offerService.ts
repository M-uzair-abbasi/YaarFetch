import api from './api';

export interface DeliveryOffer {
  id: string;
  delivererId: string;
  departureTime: string;
  returnTime: string;
  departureLocation: string;
  returnLocation: string;
  maxCapacity: number;
  serviceFee?: number;
  status: 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  deliverer?: any;
}

export const offerService = {
  createOffer: async (data: Partial<DeliveryOffer>) => {
    const response = await api.post('/offers', data);
    return response.data;
  },

  getOffers: async (params?: { status?: string; campus?: string }) => {
    const response = await api.get('/offers', { params });
    return response.data;
  },

  getOffer: async (id: string) => {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  },

  getMyOffers: async () => {
    const response = await api.get('/offers/my-offers');
    return response.data;
  },

  updateOffer: async (id: string, data: Partial<DeliveryOffer>) => {
    const response = await api.put(`/offers/${id}`, data);
    return response.data;
  },

  deleteOffer: async (id: string) => {
    const response = await api.delete(`/offers/${id}`);
    return response.data;
  },
};

