import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderService, type Order } from '../services/orderService';
import { matchService } from '../services/matchService';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadOrder();
      loadMatches();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrder(id!);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async () => {
    try {
      const data = await matchService.getMatchesForOrder(id!);
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  const handleCreateMatch = async (offerId: string) => {
    try {
      await matchService.createMatch({ orderId: id!, offerId });
      await loadMatches();
      await loadOrder();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create match');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Order not found</div>;
  }

  const isOwner = order.creatorId === user?.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:text-blue-800">
        ← Back
      </button>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{order.title}</h1>
        <p className="text-gray-700 mb-4">{order.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="font-medium">Pickup Location:</span> {order.pickupLocation}
          </div>
          <div>
            <span className="font-medium">Delivery Location:</span> {order.deliveryLocation}
          </div>
          <div>
            <span className="font-medium">Budget:</span> ${order.budget.toFixed(2)}
          </div>
          {order.deadline && (
            <div>
              <span className="font-medium">Deadline:</span> {new Date(order.deadline).toLocaleString()}
            </div>
          )}
        </div>
        {order.specialInstructions && (
          <div className="mb-4">
            <span className="font-medium">Special Instructions:</span>
            <p className="text-gray-600">{order.specialInstructions}</p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded ${order.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {order.status}
          </span>
          {order.creator && (
            <div className="flex items-center space-x-2">
              <span>Created by: {order.creator.name}</span>
              {order.creator.rating > 0 && (
                <span className="text-yellow-500">★ {order.creator.rating.toFixed(1)}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {matches.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Matches</h2>
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-medium">Deliverer: </span>
                    {match.offer?.deliverer?.name}
                    {match.offer?.deliverer?.rating > 0 && (
                      <span className="text-yellow-500 ml-2">★ {match.offer.deliverer.rating.toFixed(1)}</span>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${match.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {match.status}
                  </span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Link
                    to={`/matches/${match.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                  {selectedMatch === match.id && (
                    <Chat matchId={match.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOwner && order.status === 'ACTIVE' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Available Offers</h2>
          <p className="text-gray-600 mb-4">
            Browse available delivery offers and create a match to get your order delivered.
          </p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Browse Offers
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;

