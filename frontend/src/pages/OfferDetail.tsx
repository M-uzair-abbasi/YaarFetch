import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { offerService,type DeliveryOffer } from '../services/offerService';
import { matchService } from '../services/matchService';
import { useAuth } from '../context/AuthContext';

const OfferDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offer, setOffer] = useState<DeliveryOffer | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOffer();
      loadMatches();
    }
  }, [id]);

  const loadOffer = async () => {
    try {
      const data = await offerService.getOffer(id!);
      setOffer(data);
    } catch (error) {
      console.error('Error loading offer:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async () => {
    try {
      const data = await matchService.getMatchesForOffer(id!);
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!offer) {
    return <div className="container mx-auto px-4 py-8">Offer not found</div>;
  }

  const isOwner = offer.delivererId === user?.id;
  const departureTime = new Date(offer.departureTime);
  const returnTime = new Date(offer.returnTime);

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:text-blue-800">
        ← Back
      </button>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">Delivery Offer</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="font-medium">Departure Time:</span> {departureTime.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Return Time:</span> {returnTime.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Departure Location:</span> {offer.departureLocation}
          </div>
          <div>
            <span className="font-medium">Return Location:</span> {offer.returnLocation}
          </div>
          <div>
            <span className="font-medium">Max Capacity:</span> {offer.maxCapacity} order(s)
          </div>
          {offer.serviceFee && (
            <div>
              <span className="font-medium">Service Fee:</span> ${offer.serviceFee.toFixed(2)}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded ${offer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {offer.status}
          </span>
          {offer.deliverer && (
            <div className="flex items-center space-x-2">
              <span>Deliverer: {offer.deliverer.name}</span>
              {offer.deliverer.rating > 0 && (
                <span className="text-yellow-500">★ {offer.deliverer.rating.toFixed(1)}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {matches.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Matched Orders</h2>
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-medium">Order: </span>
                    {match.order?.title}
                    <span className="text-gray-500 ml-2">by {match.order?.creator?.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${match.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {match.status}
                  </span>
                </div>
                <Link
                  to={`/matches/${match.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block mt-2"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isOwner && offer.status === 'ACTIVE' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Available Orders</h2>
          <p className="text-gray-600 mb-4">
            Browse available orders and create a match to deliver items.
          </p>
          <Link
            to="/"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Browse Orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default OfferDetail;

