import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';
import { useUserSync } from './hooks/useUserSync';
import { motion } from 'framer-motion';

// --- CRITICAL COMPONENTS ---
import ScrollToTop from './components/ScrollToTop';
import AdminProtect from './components/routes/AdminRoute';
import ProtectedRoutes from './components/routes/protectedRoutes';
import FloatingSupport from './components/FloatingSupport';
import PrivacyPolicy from './components/Privacy';
import TermsOfService from './components/TermsOfService';

// --- LAZY PAGES ---
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesGrid'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const BookingSuccess = lazy(() => import('./components/BookingSuccess'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const SettingPage = lazy(() => import('./pages/SettingPage'));
const AddressPage = lazy(() => import('./pages/AddressPage'));
const PrivaryPage = lazy(() => import('./pages/PrivaryPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ProviderPage = lazy(() => import('./pages/ProviderPage'));
const ServiceList = lazy(() => import('./pages/ServiceList'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetailPage'));

// --- ADMIN PAGES ---
const AdminPannel = lazy(() => import('./pages/AdminPannel'));
const ManageOrderDetails = lazy(() => import('./components/AdminDashboard/ManageOrderDetails'));
const DashboardStats = lazy(() => import('./components/AdminDashboard/DashboardStats'));
const ManageCategories = lazy(() => import('./components/AdminDashboard/ManageCategories'));
const ManageServices = lazy(() => import('./components/AdminDashboard/ManageService'));
const UserDirectory = lazy(() => import('./components/AdminDashboard/UserDirectory'));
const AdminOrders = lazy(() => import('./components/AdminDashboard/AdminOrders'));
const PartnerManagement = lazy(() => import('./components/AdminDashboard/PartnerManagement'));
const OfferList = lazy(() => import('./components/AdminDashboard/OfferList'));
const AdminSettings = lazy(() => import('./components/AdminDashboard/AdminSettings'));
const LogsPage = lazy(() => import('./components/AdminDashboard/EventLogs'));

// --- PRODUCTION READY LOADER ---
const PageLoader = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
  >
    <div className="flex flex-col items-center gap-8 p-4">
      {/* Logo Section */}
      <div className="relative">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-black/20"
        >
          <span className="text-white font-black text-xl md:text-3xl tracking-tighter select-none">HS</span>
        </motion.div>
        
        {/* Subtle expansion pulse */}
        <motion.div 
          animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-black rounded-[1.5rem] -z-10"
        />
      </div>

      {/* Brand & Loading Info */}
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-sm md:text-base font-black text-slate-900 uppercase tracking-[0.4em] translate-x-[0.2em]">
          HouseXpertz
        </h2>
        
        {/* Modern Progress Line */}
        <div className="w-40 md:w-48 h-[2px] bg-slate-100 rounded-full overflow-hidden relative mt-2">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.8, 
              ease: "circInOut" 
            }}
            className="absolute inset-0 w-1/2 h-full bg-black"
          />
        </div>

        <motion.span 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1"
        >
          Initializing Secure Session
        </motion.span>
      </div>
    </div>
  </motion.div>
);

function App() {
  useUserSync();

  return (
    <HelmetProvider>
      {/* Main app container with font smoothing */}
      <div className="App select-none antialiased min-h-screen bg-white">
        <Toaster position="top-right" richColors closeButton />
        <CartProvider>
          <Router>
            <ScrollToTop />
            <FloatingSupport />
            
            {/* Suspense handles the lazy-loaded route switching */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/services/:categorySlug" element={<ServiceList />} />
                <Route path="/service/detail/:serviceSlug" element={<ServiceDetail />} />
                <Route path='/blogs' element={<BlogPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/providers" element={<ProviderPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />

                {/* ADMIN ROUTES */}
                <Route path="/admin" element={<AdminProtect><AdminPannel /></AdminProtect>}>
                  <Route index element={<DashboardStats />} />
                  <Route path="categories" element={<ManageCategories />} />
                  <Route path="services" element={<ManageServices />} />
                  <Route path="users" element={<UserDirectory />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="partners" element={<PartnerManagement />} />
                  <Route path="offers" element={<OfferList />} />
                  <Route path='logs' element={<LogsPage />} />
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

                {/* 404 CATCH-ALL */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </CartProvider>
      </div>
    </HelmetProvider>
  );
}

export default App;