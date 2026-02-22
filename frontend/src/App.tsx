import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ContactPage from './pages/ContactPage';
import CategoriesPage from './pages/CategoriesGrid';
import ShoppingPage from './pages/ShoppingPage';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './context/CartContext';
import BookingSuccess from './components/BookingSuccess';
import { Toaster } from 'sonner';
import OrderDetailsPage from './pages/OrderDetailsPage';
import SettingPage from './pages/SettingPage';
import { useUserSync } from './hooks/useUserSync';
import AddressPage from './pages/AddressPage';
import PrivaryPage from './pages/PrivaryPage';
import BlogPage from './pages/BlogPage';
import AdminPannel from './pages/AdminPannel';
import ManageOrderDetails from './components/AdminDashboard/ManageOrderDetails';
import AdminProtect from './components/Routes/AdminRoute';

// import React from 'react';

function App() {
  useUserSync()
  return (
    <>
    <Toaster position="top-right" richColors/>
    <CartProvider>
      <Router>
        <Routes>
          {/* Aapka Home page path */}
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminProtect><AdminPannel /></AdminProtect>} />
          <Route path="/admin/orders/:orderId" element={<AdminProtect><ManageOrderDetails /></AdminProtect>} />
          
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/order-history/:id" element={<OrderDetailsPage />} />
          <Route path="/categories/:categoryId" element={<ShoppingPage />} />
          <Route path="/booking-success" element={<BookingSuccess />} />

          <Route path="/profile" element={<Profile />} />
          <Route path='/blogs' element={<BlogPage/> } />
          <Route path="/profile-settings" element={<Profile />} />
          <Route path="/edit-address" element={<AddressPage />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/privacy" element={<PrivaryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shopping-cart" element={<CheckoutPage />} />
        </Routes>
      </Router>
    </CartProvider>
    </>
  );
}

export default App;