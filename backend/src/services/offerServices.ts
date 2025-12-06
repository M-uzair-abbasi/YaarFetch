// src/services/offerService.ts

export interface DeliveryOffer {
    id: string;
    title: string;
    price: number;
    description: string;
    departureTime: string; 
    returnTime: string;    
    departureLocation: string;
    returnLocation: string;
    maxCapacity: number;
    serviceFee?: number;   
    deliverer?: {          
      name: string;
    };
    status: 'OPEN' | 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED'; 
  }
  
  // You can add your API fetch function here later
  export const getOffers = async () => {
    // Placeholder for when you connect the backend
    return [];
  };