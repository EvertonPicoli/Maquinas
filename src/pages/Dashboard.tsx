import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, AlertTriangle, CheckCircle, Clock, Calendar, Users, PenTool as Tool } from 'lucide-react';
import { mockMaintenanceRequests, mockMachines, mockClients } from '../mock/data';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Filter data based on user role
  const filteredRequests = user?.role === 'client' 
    ? mockMaintenanceRequests.filter(request => request.clientId === user.id)
    : mockMaintenanceRequests;

  const filteredMachines = user?.role === 'client'
    ? mockMachines.filter(machine => machine.clientId === user.id)
    : mockMachines;

  // Calculate statistics
  const pendingRequests = filteredRequests.filter(
    (request) => request.status === 'pending' || request.status === 'scheduled'
  ).length;
  
  const machinesInMaintenance = filteredMachines.filter(
    (machine) => machine.status === 'maintenance'
  ).length;
  
  const totalClients = user?.role === 'admin' ? mockClients.length : 1;
  const totalMachines = filteredMachines.length;

  // Get recent maintenance requests
  const recentRequests = [...filteredRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Status badge component
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let color = '';
    let icon = null;

    switch (status) {
      case 'pending':
        color = 'bg-warning-100 text-warning-800';
        icon = <Clock className="w-4 h-4 mr-1" />;
        break;
      case 'scheduled':
        color = 'bg-primary-100 text-primary-800';
        icon = <Calendar className="w-4 h-4 mr-1" />;
        break;
      case 'in_progress':
        color = 'bg-accent-100 text-accent-800';
        icon = <AlertTriangle className="w-4 h-4 mr-1" />;
        break;
      case 'completed':
        color = 'bg-success-100 text-success-800';
        icon = <CheckCircle className="w-4 h-4 mr-1" />;
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {icon}
        {status === 'pending' ? 'Pendente' : 
         status === 'scheduled' ? 'Agendado' : 
         status === 'in_progress' ? 'Em andamento' : 
         status === 'completed' ? 'Concluído' : 
         status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          {user?.role === 'client' ? 'Visão geral da sua empresa' : 'Visão geral do sistema de manutenção'}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-warning-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Chamados Pendentes</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{pendingRequests}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/maintenance-requests" className="font-medium text-primary-600 hover:text-primary-900">
                Ver todos
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-accent-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Máquinas em Manutenção</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{machinesInMaintenance}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/machines" className="font-medium text-primary-600 hover:text-primary-900">
                Ver todas
              </Link>
            </div>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Clientes</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{totalClients}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/clients" className="font-medium text-primary-600 hover:text-primary-900">
                  Ver todos
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Tool className="h-6 w-6 text-secondary-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Máquinas</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{totalMachines}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/machines" className="font-medium text-primary-600 hover:text-primary-900">
                Ver todas
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent maintenance requests */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Chamados Recentes</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Últimos 5 chamados de manutenção</p>
          </div>
          <Link to="/maintenance-requests" className="text-sm font-medium text-primary-600 hover:text-primary-900 flex items-center">
            Ver todos 
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentRequests.map((request) => {
            const client = mockClients.find(client => client.id === request.clientId);
            const machine = mockMachines.find(machine => machine.id === request.machineId);
            
            return (
              <li key={request.id} className="hover:bg-gray-50 transition duration-150">
                <Link to={`/maintenance-requests/${request.id}`} className="block">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary-600 truncate max-w-md">{request.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <StatusBadge status={request.status} />
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex flex-wrap gap-6">
                        {user?.role === 'admin' && (
                          <p className="flex items-center text-sm text-gray-500">
                            <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <span className="truncate">{client?.name}</span>
                          </p>
                        )}
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Tool className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <span className="truncate">{machine?.name}</span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>
                          {request.scheduledDate 
                            ? `Agendado para: ${new Date(request.scheduledDate).toLocaleDateString('pt-BR')}`
                            : `Aberto em: ${new Date(request.createdAt).toLocaleDateString('pt-BR')}`}
                        </p>
                      </div>
                    </div>
                    {request.technician && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Técnico designado:</span> {request.technician}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;