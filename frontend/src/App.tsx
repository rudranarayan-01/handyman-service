import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import OrderHistoryPage from './pages/OrderHistoryPage';
import SettingsPage from './components/Settings';
import ContactPage from './pages/ContactPage';
import CategoriesPage from './pages/CategoriesGrid';
import ShoppingPage from './pages/ShoppingPage';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './context/CartContext';
import BookingSuccess from './components/BookingSuccess';
import { Toaster } from 'sonner';
import OrderDetailsPage from './pages/OrderDetailsPage';

function App() {
  return (
    <>
    <Toaster position="top-right" />
    <CartProvider>
      <Router>
        <Routes>
          {/* Aapka Home page path */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/order-history/:id" element={<OrderDetailsPage />} />
          <Route path="/categories/:categoryId" element={<ShoppingPage />} />

          {/* Profile page path */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/:username/settings" element={<SettingsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shopping-cart" element={<CheckoutPage />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Routes>
      </Router>
    </CartProvider>
    </>
  );
}

export default App;