import { Suspense, lazy } from 'react'; // Added lazy and Suspense
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';
import { useUserSync } from './hooks/useUserSync';

// 1. COMPONENTS THAT SHOULD LOAD IMMEDIATELY (Critical Path)
import ScrollToTop from './components/ScrollToTop';
import AdminProtect from './components/routes/AdminRoute';
import ProtectedRoutes from './components/routes/protectedRoutes';
import FloatingSupport from './components/FloatingSupport';

// 2. LAZY LOAD PUBLIC PAGES
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

// 3. LAZY LOAD HEAVY ADMIN PAGES (The biggest savings)
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

// 4. LOADING FALLBACK (Crucial for UX)
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white">
    <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  useUserSync();

  return (
    <HelmetProvider>
      <div className="App select-none">
        <Toaster position="top-right" richColors />
        <CartProvider>
          <Router>
            <ScrollToTop />
            {/* Wrap Routes in Suspense to handle lazy loading */}
            <FloatingSupport/>
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

                {/* ADMIN ROUTES - Now totally isolated from main bundle */}
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