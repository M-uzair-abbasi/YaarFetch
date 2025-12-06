import { Link } from 'react-router-dom';

import type { DeliveryOffer } from '../services/offerService';

interface OfferCardProps {
  offer: DeliveryOffer;
}

const OfferCard = ({ offer }: OfferCardProps) => {
  const departureTime = new Date(offer.departureTime);
  const returnTime = new Date(offer.returnTime);

  return (
    <Link to={`/offers/${offer.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold mb-2">Delivery Offer</h3>
        <div className="space-y-2 text-sm mb-4">
          <div>
            <span className="font-medium">Departure:</span> {departureTime.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Return:</span> {returnTime.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">From:</span> {offer.departureLocation}
          </div>
          <div>
            <span className="font-medium">To:</span> {offer.returnLocation}
          </div>
          <div>
            <span className="font-medium">Capacity:</span> {offer.maxCapacity} order(s)
          </div>
          {offer.serviceFee && (
            <div>
              <span className="font-medium">Service Fee:</span> ${offer.serviceFee.toFixed(2)}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className={`px-2 py-1 rounded text-xs ${
            offer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
            offer.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {offer.status}
          </span>
          {offer.deliverer && (
            <span className="text-gray-500 text-xs">
              by {offer.deliverer.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default OfferCard;

