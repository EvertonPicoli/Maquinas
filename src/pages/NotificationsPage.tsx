import React, { useState } from 'react';
import { Bell, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { mockNotifications } from '../mock/data';
import { Notification } from '../types';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <AlertTriangle className="h-6 w-6 text-warning-500" />;
      case 'preventive':
        return <Calendar className="h-6 w-6 text-primary-500" />;
      case 'system':
        return <CheckCircle className="h-6 w-6 text-success-500" />;
      default:
        return <Bell className="h-6 w-6 text-accent-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="animate-fade-in">
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
        {unreadCount > 0 && (
          <div className="mt-3 flex sm:mt-0 sm:ml-4">
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Marcar todas como lidas
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        {unreadCount === 0 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md py-6 px-4 text-center text-gray-500">
            Não há novas notificações
          </div>
        )}

        <ul className="divide-y divide-gray-200 bg-white shadow overflow-hidden sm:rounded-md">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 
                ${!notification.read ? 'bg-primary-50' : ''}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        className="text-sm text-primary-600 hover:text-primary-800"
                      >
                        Marcar como lida
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationsPage;