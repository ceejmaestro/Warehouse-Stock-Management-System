import { Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from "./components/ProtectedRoute";
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import ItemPage from './pages/ItemPage';
import InventoryPage from './pages/InventoryPage';
import DistributionPage from './pages/DistributionPage';
import ReportPage from './pages/ReportPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/manageuser" element={<PrivateRoute><UserPage /></PrivateRoute>} />
      <Route path="/manageitem" element={<PrivateRoute><ItemPage /></PrivateRoute>} />
      <Route path="/manageinventory" element={<PrivateRoute><InventoryPage /></PrivateRoute>} />
      <Route path="/managedistribution" element={<PrivateRoute><DistributionPage /></PrivateRoute>} />
      <Route path="/generate" element={<PrivateRoute><ReportPage /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
