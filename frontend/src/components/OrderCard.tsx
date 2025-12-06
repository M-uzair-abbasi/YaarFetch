import { Link } from 'react-router-dom';
import type { Order } from '../services/orderService';

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Link to={`/orders/${order.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold mb-2">{order.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{order.description}</p>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Pickup:</span> {order.pickupLocation}
          </div>
          <div>
            <span className="font-medium">Delivery:</span> {order.deliveryLocation}
          </div>
          <div>
            <span className="font-medium">Budget:</span> ${order.budget.toFixed(2)}
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className={`px-2 py-1 rounded text-xs ${
              order.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              order.status === 'MATCHED' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status}
            </span>
            {order.creator && (
              <span className="text-gray-500 text-xs">
                by {order.creator.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;

