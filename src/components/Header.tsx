import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockNotifications } from '../mock/data';

type HeaderProps = {
  openSidebar: () => void;
};

const Header: React.FC<HeaderProps> = ({ openSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const unreadNotifications = mockNotifications.filter(notification => !notification.read).length;

  return (
    <header className="z-10 py-4 bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
              onClick={openSidebar}
            >
              <span className="sr-only">Abrir menu lateral</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 hidden md:block">
              Sistema de Gestão de Manutenção
            </h1>
          </div>
          
          <div className="ml-4 flex items-center md:ml-6">
            <button
              type="button"
              className="relative p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => navigate('/notifications')}
            >
              <span className="sr-only">Ver notificações</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="hidden md:block">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                  </div>
                </div>
                
                <div className="ml-3 flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-700" />
                </div>
                
                <button
                  type="button"
                  className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Sair</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;