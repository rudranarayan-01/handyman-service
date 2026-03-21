import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // Added for SEO
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';
import { useUserSync } from './hooks/useUserSync';

// Pages & Components
import Home from './pages/Home';
import Profile from './pages/Profile';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ContactPage from './pages/ContactPage';
import CategoriesPage from './pages/CategoriesGrid';
import CheckoutPage from './pages/CheckoutPage';
import BookingSuccess from './components/BookingSuccess';
import OrderDetailsPage from './pages/OrderDetailsPage';
import SettingPage from './pages/SettingPage';
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
import AdminSettings from './components/AdminDashboard/AdminSettings';
import ServiceList from './pages/ServiceList';
import ServiceDetail from './pages/ServiceDetailPage';
import LogsPage from './components/AdminDashboard/EventLogs';

function App() {
  useUserSync();

  return (
    <HelmetProvider> {/* Wrap app for SEO control */}
      <div className="App select-none">
        <Toaster position="top-right" richColors />
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              
              {/* SEO OPTIMIZED SERVICES ROUTES */}
              <Route path="/categories" element={<CategoriesPage />} />
              
              {/* Dynamic Category Route: e.g., /services/ac-repair */}
              <Route path="/services/:categorySlug" element={<ServiceList />} />
              
              {/* Dynamic Service Route: e.g., /service/detail/split-ac-gas-leak-fix */}
              <Route path="/service/detail/:serviceSlug" element={<ServiceDetail />} />
              
              <Route path='/blogs' element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/providers" element={<ProviderPage />} />

              {/* ADMIN ROUTES */}
              <Route path="/admin" element={<AdminProtect><AdminPannel /></AdminProtect>} >
                <Route index element={<DashboardStats />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="services" element={<ManageServices />} />
                <Route path="users" element={<UserDirectory />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="partners" element={<PartnerManagement />} />
                <Route path="offers" element={<OfferList />} />
                <Route path='logs' element={<LogsPage/>} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route path="/admin/orders/:orderId" element={<AdminProtect><ManageOrderDetails /></AdminProtect>} />

              {/* PROTECTED USER ROUTES */}
              <Route path="/order-history" element={<ProtectedRoutes><OrderHistoryPage /></ProtectedRoutes>} />
              <Route path="/order-history/:id" element={<ProtectedRoutes><OrderDetailsPage /></ProtectedRoutes>} />
              <Route path="/booking-success" element={<ProtectedRoutes><BookingSuccess /></ProtectedRoutes>} />
              <Route path="/profile" element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
              <Route path="/profile-settings" element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
              <Route path="/edit-address" element={<ProtectedRoutes><AddressPage /></ProtectedRoutes>} />
              <Route path="/settings" element={<ProtectedRoutes><SettingPage /></ProtectedRoutes>} />
              <Route path="/privacy" element={<ProtectedRoutes><PrivaryPage /></ProtectedRoutes>} />
              <Route path="/shopping-cart" element={<ProtectedRoutes><CheckoutPage /></ProtectedRoutes>} />

              {/* 404 REDIRECT */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </div>
    </HelmetProvider>
  );
}

export default App;