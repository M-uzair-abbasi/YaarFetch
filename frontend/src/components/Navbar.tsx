import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            YAAR FETCH
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/" className="hover:text-blue-200">Dashboard</Link>
                <Link to="/create-order" className="hover:text-blue-200">Create Order</Link>
                <Link to="/create-offer" className="hover:text-blue-200">Create Offer</Link>
                <Link to="/my-orders" className="hover:text-blue-200">My Orders</Link>
                <Link to="/my-offers" className="hover:text-blue-200">My Offers</Link>
                <Link to="/profile" className="hover:text-blue-200">Profile</Link>
                <button onClick={logout} className="hover:text-blue-200">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="hover:text-blue-200">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

