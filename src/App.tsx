import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import OrderHistoryPage from './pages/OrderHistoryPage';
import SettingsPage from './components/Settings';
import CategoriesPage from './pages/CategoriesPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Aapka Home page path */}
        <Route path="/" element={<Home/>} />
        <Route path="/services" element={<CategoriesPage/>} />
        <Route path="/order-history" element={<OrderHistoryPage/>} />
        
        {/* Profile page path */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/:username/settings" element={<SettingsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;