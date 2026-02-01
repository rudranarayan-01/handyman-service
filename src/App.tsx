import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import OrderHistoryPage from './pages/OrderHistoryPage';
import SettingsPage from './components/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Aapka Home page path */}
        <Route path="/" element={<Home/>} />
        <Route path="/order-history" element={<OrderHistoryPage/>} />
        
        {/* Profile page path */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/:username/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;