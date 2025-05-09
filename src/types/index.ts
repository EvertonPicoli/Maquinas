export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'client';
};

export type Client = {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  createdAt: string;
  password?: string; // Added for client authentication
};

export type Machine = {
  id: string;
  clientId: string;
  name: string;
  model: string;
  serialNumber: string;
  acquisitionDate: string;
  hourMeter?: number;
  status: 'operational' | 'maintenance' | 'inactive';
  documents: Document[];
  photos: Photo[];
};

export type Document = {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
};

export type Photo = {
  id: string;
  url: string;
  description?: string;
  uploadedAt: string;
};

export type MaintenanceRequest = {
  id: string;
  clientId: string;
  machineId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  scheduledDate?: string;
  completedAt?: string;
  resolution?: string;
  attachments: Attachment[];
  technician?: string;
};

export type Attachment = {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  uploadedAt: string;
};

export type MaintenanceHistory = {
  id: string;
  machineId: string;
  title: string;
  description: string;
  performedAt: string;
  performedBy: string;
  type: 'corrective' | 'preventive';
  parts?: Part[];
};

export type Part = {
  id: string;
  name: string;
  quantity: number;
  price?: number;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'maintenance' | 'preventive' | 'system';
  read: boolean;
  createdAt: string;
};