import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateOrder from './pages/CreateOrder';
import CreateOffer from './pages/CreateOffer';
import OrderDetail from './pages/OrderDetail';
import OfferDetail from './pages/OfferDetail';
import MatchDetail from './pages/MatchDetail';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import MyOffers from './pages/MyOffers';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-order"
          element={
            <PrivateRoute>
              <CreateOrder />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-offer"
          element={
            <PrivateRoute>
              <CreateOffer />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <PrivateRoute>
              <OrderDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/offers/:id"
          element={
            <PrivateRoute>
              <OfferDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/matches/:id"
          element={
            <PrivateRoute>
              <MatchDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-offers"
          element={
            <PrivateRoute>
              <MyOffers />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
