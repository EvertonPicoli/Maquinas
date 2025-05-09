import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { mockClients } from '../mock/data';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

// Mock admin user
const mockAdminUser: User = {
  id: '1',
  name: 'Admin Demo',
  email: 'admin@example.com',
  role: 'admin',
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if it's the admin
      if (email === 'admin@example.com' && password === 'password') {
        setUser(mockAdminUser);
        return;
      }

      // Check if it's a client
      const client = mockClients.find(c => c.email === email && c.password === password);
      if (client) {
        setUser({
          id: client.id,
          name: client.name,
          email: client.email,
          role: 'client'
        });
        return;
      }

      throw new Error('Credenciais inválidas');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};