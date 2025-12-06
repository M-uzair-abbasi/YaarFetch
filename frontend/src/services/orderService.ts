import api from './api';

export interface Order {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  pickupLocation: string;
  deliveryLocation: string;
  budget: number;
  deadline?: string;
  status: 'DRAFT' | 'ACTIVE' | 'MATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  specialInstructions?: string;
  createdAt: string;
  creator?: any;
}

export const orderService = {
  createOrder: async (data: Partial<Order>) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getOrders: async (params?: { status?: string; campus?: string }) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrder: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  updateOrder: async (id: string, data: Partial<Order>) => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },

  deleteOrder: async (id: string) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

