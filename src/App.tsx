import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import NewClient from './pages/NewClient';
import ClientDetail from './pages/ClientDetail';
import Machines from './pages/Machines';
import NewMachine from './pages/NewMachine';
import MachineDetail from './pages/MachineDetail';
import MaintenanceRequests from './pages/MaintenanceRequests';
import NewMaintenanceRequest from './pages/NewMaintenanceRequest';
import MaintenanceRequestDetail from './pages/MaintenanceRequestDetail';
import NotificationsPage from './pages/NotificationsPage';
import ProtectedRoute from './components/ProtectedRoute';
import ClientRoute from './components/ClientRoute';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<AdminRoute><Clients /></AdminRoute>} />
            <Route path="/clients/new" element={<AdminRoute><NewClient /></AdminRoute>} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/machines" element={<Machines />} />
            <Route path="/machines/new" element={<NewMachine />} />
            <Route path="/machines/:id" element={<MachineDetail />} />
            <Route path="/maintenance-requests" element={<MaintenanceRequests />} />
            <Route path="/maintenance-requests/new" element={<NewMaintenanceRequest />} />
            <Route path="/maintenance-requests/:id" element={<MaintenanceRequestDetail />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;