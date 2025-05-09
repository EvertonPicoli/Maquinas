import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, PenTool as Tool, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { mockMaintenanceRequests, mockClients, mockMachines } from '../mock/data';
import StatusBadge from '../components/StatusBadge';

const MaintenanceRequestDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isResolvingRequest, setIsResolvingRequest] = useState(false);
  const [resolution, setResolution] = useState('');

  // Find the request in the mock data
  const requestIndex = mockMaintenanceRequests.findIndex(req => req.id === id);
  const request = requestIndex !== -1 ? mockMaintenanceRequests[requestIndex] : null;
  const client = request ? mockClients.find(c => c.id === request.clientId) : null;
  const machine = request ? mockMachines.find(m => m.id === request.machineId) : null;

  if (!request || !client || !machine) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Chamado não encontrado</h2>
      </div>
    );
  }

  const handleResolveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the request in the mock data
    mockMaintenanceRequests[requestIndex] = {
      ...request,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };

    // Navigate back to the maintenance requests list
    navigate('/maintenance-requests', { replace: true });
  };

  const getStatusIcon = () => {
    switch (request.status) {
      case 'pending':
        return <Clock className="h-8 w-8 text-warning-500" />;
      case 'scheduled':
        return <Calendar className="h-8 w-8 text-primary-500" />;
      case 'in_progress':
        return <AlertTriangle className="h-8 w-8 text-accent-500" />;
      case 'completed':
        return <CheckCircle className="h-8 w-8 text-success-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Detalhes do Chamado</h1>
        {request.status !== 'completed' && !isResolvingRequest && (
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <button
              type="button"
              onClick={() => setIsResolvingRequest(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Resolver Chamado
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-8">
        {/* Request Details */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon()}
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {request.title}
                  </h3>
                  <StatusBadge status={request.status} />
                </div>
              </div>
              <StatusBadge status={request.priority} />
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-400" />
                  Cliente
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{client.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Tool className="h-5 w-5 mr-2 text-gray-400" />
                  Máquina
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{machine.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Data de Abertura</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                </dd>
              </div>
              {request.scheduledDate && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Data Agendada</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(request.scheduledDate).toLocaleDateString('pt-BR')}
                  </dd>
                </div>
              )}
              {request.technician && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Técnico Responsável</dt>
                  <dd className="mt-1 text-sm text-gray-900">{request.technician}</dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Descrição</dt>
                <dd className="mt-1 text-sm text-gray-900">{request.description}</dd>
              </div>
              {request.completedAt && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Concluído em</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(request.completedAt).toLocaleDateString('pt-BR')}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Photos */}
        {request.attachments.length > 0 && (
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Fotos Anexadas
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {request.attachments.map((attachment, index) => (
                    <div key={index} className="relative">
                      <img
                        src={attachment.url}
                        alt={`Anexo ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resolution Form */}
        {isResolvingRequest && (
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Resolução do Chamado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Descreva a solução aplicada e marque o chamado como concluído
              </p>
            </div>
            <div className="border-t border-gray-200">
              <form onSubmit={handleResolveRequest} className="px-4 py-5 sm:px-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="resolution" className="block text-sm font-medium text-gray-700">
                      Descrição da Resolução
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="resolution"
                        name="resolution"
                        rows={4}
                        required
                        className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder="Descreva como o problema foi resolvido..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsResolvingRequest(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-success-600 hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500"
                    >
                      Marcar como Concluído
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceRequestDetail;