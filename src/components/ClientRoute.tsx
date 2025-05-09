import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type ClientRouteProps = {
  children: ReactNode;
  clientId: string;
};

const ClientRoute: React.FC<ClientRouteProps> = ({ children, clientId }) => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <>{children}</>;
  }

  if (user?.role === 'client' && user.id === clientId) {
    return <>{children}</>;
  }

  return <Navigate to="/dashboard" replace />;
};

export default ClientRoute;