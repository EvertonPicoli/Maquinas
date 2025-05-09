import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building, Calendar, Clock, FileText, Image as ImageIcon, History, PenTool as Tool, Users } from 'lucide-react';
import { mockMachines, mockClients, mockMaintenanceHistory, mockMaintenanceRequests } from '../mock/data';
import StatusBadge from '../components/StatusBadge';

const MachineDetail: React.FC = () => {
  const { id } = useParams();
  const machine = mockMachines.find(m => m.id === id);
  const client = machine ? mockClients.find(c => c.id === machine.clientId) : null;
  const maintenanceHistory = mockMaintenanceHistory.filter(h => h.machineId === id);
  const maintenanceRequests = mockMaintenanceRequests.filter(r => r.machineId === id);

  if (!machine || !client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Máquina não encontrada</h2>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">{machine.name}</h2>
                <p className="text-sm text-gray-500">Modelo: {machine.model}</p>
              </div>
            </div>
            <StatusBadge status={machine.status} />
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
              <dt className="text-sm font-medium text-gray-500">Número de Série</dt>
              <dd className="mt-1 text-sm text-gray-900">{machine.serialNumber}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                Data de Aquisição
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(machine.acquisitionDate).toLocaleDateString('pt-BR')}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-400" />
                Horímetro
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {machine.hourMeter ? `${machine.hourMeter} horas` : 'Não registrado'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Photos Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <ImageIcon className="h-5 w-5 mr-2 text-gray-400" />
            Fotos da Máquina
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {machine.photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt={photo.description || 'Foto da máquina'}
                    className="h-40 w-full object-cover rounded-lg"
                  />
                  {photo.description && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm rounded-b-lg">
                      {photo.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-gray-400" />
            Documentos Técnicos
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {machine.documents.map((doc) => (
              <li key={doc.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <p className="ml-2 text-sm font-medium text-gray-900">{doc.name}</p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <a
                      href={doc.url}
                      className="font-medium text-primary-600 hover:text-primary-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visualizar
                    </a>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Adicionado em: {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Maintenance History Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <History className="h-5 w-5 mr-2 text-gray-400" />
            Histórico de Manutenções
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {maintenanceHistory.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {maintenanceHistory.map((maintenance) => (
                <li key={maintenance.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{maintenance.title}</h4>
                      <p className="mt-1 text-sm text-gray-500">{maintenance.description}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${maintenance.type === 'preventive' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {maintenance.type === 'preventive' ? 'Preventiva' : 'Corretiva'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Realizada por: {maintenance.performedBy}</p>
                    <p>Data: {new Date(maintenance.performedAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  {maintenance.parts && maintenance.parts.length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium text-gray-700">Peças utilizadas:</h5>
                      <ul className="mt-1 space-y-1">
                        {maintenance.parts.map((part) => (
                          <li key={part.id} className="text-sm text-gray-500">
                            {part.name} - {part.quantity} unid.
                            {part.price && ` - R$ ${part.price.toFixed(2)}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
              Nenhum registro de manutenção encontrado
            </div>
          )}
        </div>
      </div>

      {/* Active Maintenance Requests */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Tool className="h-5 w-5 mr-2 text-gray-400" />
            Chamados de Manutenção
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {maintenanceRequests.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {maintenanceRequests.map((request) => (
                <li key={request.id} className="px-4 py-4 sm:px-6">
                  <Link
                    to={`/maintenance-requests/${request.id}`}
                    className="block hover:bg-gray-50 -mx-4 -my-4 px-4 py-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-primary-600">{request.title}</h4>
                        <p className="mt-1 text-sm text-gray-500">{request.description}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <StatusBadge status={request.status} size="sm" />
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Aberto em: {new Date(request.createdAt).toLocaleDateString('pt-BR')}</p>
                      {request.scheduledDate && (
                        <p>Agendado para: {new Date(request.scheduledDate).toLocaleDateString('pt-BR')}</p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
              Nenhum chamado de manutenção encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MachineDetail;