import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { offerService, type DeliveryOffer } from '../services/offerService';
import OfferCard from '../components/OfferCard';

const MyOffers = () => {
  const [offers, setOffers] = useState<DeliveryOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const data = await offerService.getMyOffers();
      setOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Offers</h1>
        <Link
          to="/create-offer"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create New Offer
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            You haven't created any offers yet.
          </div>
        ) : (
          offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
        )}
      </div>
    </div>
  );
};

export default MyOffers;

