import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Calendar, Minus } from 'lucide-react';

type StatusBadgeProps = {
  status: string;
  size?: 'sm' | 'md';
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let color = '';
  let icon = null;
  let label = status;

  // Maintenance request status
  switch (status) {
    case 'pending':
      color = 'bg-warning-100 text-warning-800';
      icon = <Clock className="w-4 h-4 mr-1" />;
      label = 'Pendente';
      break;
    case 'scheduled':
      color = 'bg-primary-100 text-primary-800';
      icon = <Calendar className="w-4 h-4 mr-1" />;
      label = 'Agendado';
      break;
    case 'in_progress':
      color = 'bg-accent-100 text-accent-800';
      icon = <AlertTriangle className="w-4 h-4 mr-1" />;
      label = 'Em andamento';
      break;
    case 'completed':
      color = 'bg-success-100 text-success-800';
      icon = <CheckCircle className="w-4 h-4 mr-1" />;
      label = 'Concluído';
      break;
    case 'cancelled':
      color = 'bg-error-100 text-error-800';
      icon = <Minus className="w-4 h-4 mr-1" />;
      label = 'Cancelado';
      break;
  }

  // Machine status
  switch (status) {
    case 'operational':
      color = 'bg-success-100 text-success-800';
      icon = <CheckCircle className="w-4 h-4 mr-1" />;
      label = 'Operacional';
      break;
    case 'maintenance':
      color = 'bg-warning-100 text-warning-800';
      icon = <AlertTriangle className="w-4 h-4 mr-1" />;
      label = 'Em manutenção';
      break;
    case 'inactive':
      color = 'bg-gray-100 text-gray-800';
      icon = <Minus className="w-4 h-4 mr-1" />;
      label = 'Inativa';
      break;
  }

  // Priority status
  switch (status) {
    case 'low':
      color = 'bg-success-100 text-success-800';
      label = 'Baixa';
      break;
    case 'medium':
      color = 'bg-accent-100 text-accent-800';
      label = 'Média';
      break;
    case 'high':
      color = 'bg-warning-100 text-warning-800';
      label = 'Alta';
      break;
    case 'critical':
      color = 'bg-error-100 text-error-800';
      label = 'Crítica';
      break;
  }

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-2.5 py-0.5 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${color} ${sizeClasses}`}>
      {icon}
      {label}
    </span>
  );
};

export default StatusBadge;