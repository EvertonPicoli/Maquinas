import { Client, Machine, MaintenanceRequest, MaintenanceHistory, Notification } from '../types';
import { format, subDays, addDays } from 'date-fns';

// Clients mock data
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Indústria Mecânica Silva Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'silva@example.com',
    password: 'silva123',
    phone: '(11) 4567-8900',
    address: 'Av. Industrial, 1000, São Paulo - SP',
    contactPerson: 'Carlos Silva',
    createdAt: format(subDays(new Date(), 100), 'yyyy-MM-dd'),
  }
];

// Machines mock data
export const mockMachines: Machine[] = [
  {
    id: '1',
    clientId: '1',
    name: 'Torno CNC Industrial',
    model: 'TornMaster X500',
    serialNumber: 'TM-X500-12345',
    acquisitionDate: format(subDays(new Date(), 365), 'yyyy-MM-dd'),
    hourMeter: 1200,
    status: 'operational',
    documents: [
      {
        id: '1',
        name: 'Manual Técnico',
        url: '#',
        type: 'pdf',
        uploadedAt: format(subDays(new Date(), 360), 'yyyy-MM-dd'),
      }
    ],
    photos: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/6325736/pexels-photo-6325736.jpeg',
        description: 'Vista frontal do torno',
        uploadedAt: format(subDays(new Date(), 360), 'yyyy-MM-dd'),
      }
    ]
  }
];

// Maintenance Requests mock data
export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    clientId: '1',
    machineId: '1',
    title: 'Manutenção Preventiva',
    description: 'Manutenção preventiva programada conforme manual.',
    priority: 'medium',
    status: 'pending',
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    attachments: []
  }
];

// Maintenance History mock data
export const mockMaintenanceHistory: MaintenanceHistory[] = [
  {
    id: '1',
    machineId: '1',
    title: 'Instalação inicial',
    description: 'Instalação e configuração inicial do equipamento.',
    performedAt: format(subDays(new Date(), 365), 'yyyy-MM-dd'),
    performedBy: 'Ricardo Técnico',
    type: 'preventive',
    parts: []
  }
];

// Notifications mock data
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Bem-vindo ao Sistema',
    message: 'Bem-vindo ao Sistema de Gestão de Manutenção.',
    type: 'system',
    read: false,
    createdAt: format(new Date(), 'yyyy-MM-dd'),
  }
];