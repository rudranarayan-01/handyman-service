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
import AdminProtect from './components/routes/AdminRoute';
import ProtectedRoutes from './components/routes/ProtectedRoutes';

// import React from 'react';

function App() {
  useUserSync()
  return (
    <>
    <Toaster position="top-right" richColors/>
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminProtect><AdminPannel /></AdminProtect>} />
          <Route path="/admin/orders/:orderId" element={<AdminProtect><ManageOrderDetails /></AdminProtect>} />
          
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:categoryId" element={<ShoppingPage />} />
          <Route path='/blogs' element={<BlogPage/> } />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/order-history" element={<ProtectedRoutes><OrderHistoryPage /></ProtectedRoutes>} />
          <Route path="/order-history/:id" element={<ProtectedRoutes><OrderDetailsPage /></ProtectedRoutes>} />
          <Route path="/booking-success" element={<ProtectedRoutes><BookingSuccess /></ProtectedRoutes>} />
          <Route path="/profile" element={<ProtectedRoutes><Profile/></ProtectedRoutes>} />
          <Route path="/profile-settings" element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
          <Route path="/edit-address" element={<ProtectedRoutes><AddressPage /></ProtectedRoutes>} />
          <Route path="/settings" element={<ProtectedRoutes><SettingPage /></ProtectedRoutes>} />
          <Route path="/privacy" element={<ProtectedRoutes><PrivaryPage /></ProtectedRoutes>} />
          <Route path="/shopping-cart" element={<ProtectedRoutes><CheckoutPage /></ProtectedRoutes>} />
        </Routes>
      </Router>
    </CartProvider>
    </>
  );
}

export default App;