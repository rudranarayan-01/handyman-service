import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import ProtectedRoutes from './components/routes/protectedRoutes';
import ScrollToTop from './components/ScrollToTop';
import ProviderPage from './pages/ProviderPage';
import DashboardStats from './components/AdminDashboard/DashboardStats';
import ManageCategories from './components/AdminDashboard/ManageCategories';
import ManageServices from './components/AdminDashboard/ManageService';
import UserDirectory from './components/AdminDashboard/UserDirectory';
import AdminOrders from './components/AdminDashboard/AdminOrders';
import PartnerManagement from './components/AdminDashboard/PartnerManagement';
import OfferList from './components/AdminDashboard/OfferList';


function App() {
  useUserSync()
  return (
    <div className="App select-none">
      <Toaster position="top-right" richColors />
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminProtect><AdminPannel /></AdminProtect>} >
              {/* Child Routes - They appear in the <Outlet /> */}
              <Route index element={<DashboardStats />} /> {/* This is the default /admin */}
              <Route path="categories" element={<ManageCategories />} />
              <Route path="services" element={<ManageServices />} />
              <Route path="users" element={<UserDirectory />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="partners" element={<PartnerManagement />} />
              <Route path="offers" element={<OfferList />} />
              {/* <Route path="settings" element={<AdminSettings />} /> */}
            </Route>
            <Route path="/admin/orders/:orderId" element={<AdminProtect><ManageOrderDetails /></AdminProtect>} />

            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:categoryId" element={<ShoppingPage />} />
            <Route path='/blogs' element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/providers" element={<ProviderPage />} />
            {/* <Route path="/about" element={<AboutPage />} /> */}

            <Route path="/order-history" element={<ProtectedRoutes><OrderHistoryPage /></ProtectedRoutes>} />
            <Route path="/order-history/:id" element={<ProtectedRoutes><OrderDetailsPage /></ProtectedRoutes>} />
            <Route path="/booking-success" element={<ProtectedRoutes><BookingSuccess /></ProtectedRoutes>} />
            <Route path="/profile" element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
            <Route path="/profile-settings" element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
            <Route path="/edit-address" element={<ProtectedRoutes><AddressPage /></ProtectedRoutes>} />
            <Route path="/settings" element={<ProtectedRoutes><SettingPage /></ProtectedRoutes>} />
            <Route path="/privacy" element={<ProtectedRoutes><PrivaryPage /></ProtectedRoutes>} />
            <Route path="/shopping-cart" element={<ProtectedRoutes><CheckoutPage /></ProtectedRoutes>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </div>
  );
}

export default App;