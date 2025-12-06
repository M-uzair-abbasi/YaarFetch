import api from './api';

export interface Review {
  id: string;
  matchId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer?: any;
  reviewee?: any;
}

export const reviewService = {
  createReview: async (data: {
    matchId: string;
    revieweeId: string;
    rating: number;
    comment?: string;
  }) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  getReviews: async (userId: string) => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },

  getReview: async (id: string) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },
};

