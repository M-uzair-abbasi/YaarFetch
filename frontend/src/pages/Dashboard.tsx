import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService, type Order } from '../services/orderService';
import { offerService } from '../services/offerService';
import type { DeliveryOffer } from '../services/offerService';
import OrderCard from '../components/OrderCard';
import OfferCard from '../components/OfferCard';

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<DeliveryOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'offers'>('orders');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersData, offersData] = await Promise.all([
        orderService.getOrders({ status: 'ACTIVE' }),
        offerService.getOffers({ status: 'ACTIVE' }),
      ]);
      setOrders(ordersData);
      setOffers(offersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="flex space-x-4 mb-4">
          <Link
            to="/create-order"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Order
          </Link>
          <Link
            to="/create-offer"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Offer
          </Link>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 ${activeTab === 'orders' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
          >
            Active Orders
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 ${activeTab === 'offers' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
          >
            Active Offers
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No active orders found
            </div>
          ) : (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No active offers found
            </div>
          ) : (
            offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

