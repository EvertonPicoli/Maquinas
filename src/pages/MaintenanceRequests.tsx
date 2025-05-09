import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Calendar, PenTool as Tool, Users } from 'lucide-react';
import { mockMaintenanceRequests, mockClients, mockMachines } from '../mock/data';
import StatusBadge from '../components/StatusBadge';

const MaintenanceRequests: React.FC = () => {
  const navigate = useNavigate();
  const sortedRequests = [...mockMaintenanceRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="animate-fade-in">
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Chamados de Manutenção</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => navigate('/maintenance-requests/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Novo Chamado
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {sortedRequests.map((request) => {
            const client = mockClients.find(client => client.id === request.clientId);
            const machine = mockMachines.find(machine => machine.id === request.machineId);
            
            return (
              <li key={request.id}>
                <Link
                  to={`/maintenance-requests/${request.id}`}
                  className="block hover:bg-gray-50 transition duration-150"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          {request.title}
                        </p>
                        <div className="ml-2">
                          <StatusBadge status={request.priority} size="sm" />
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <StatusBadge status={request.status} />
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {client?.name}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <Tool className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {machine?.name}
                        </div>
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

export default MaintenanceRequests;