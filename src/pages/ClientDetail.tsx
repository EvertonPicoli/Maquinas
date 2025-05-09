import React from 'react';
import { useParams } from 'react-router-dom';
import { Users, Phone, Mail, MapPin, Building } from 'lucide-react';
import { mockClients, mockMachines } from '../mock/data';

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const client = mockClients.find(c => c.id === id);
  const clientMachines = mockMachines.filter(m => m.clientId === id);

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Cliente não encontrado</h2>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary-600" />
            <h2 className="ml-4 text-2xl font-bold text-gray-900">{client.name}</h2>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">CNPJ</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.cnpj}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Contato</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.contactPerson}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Telefone
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{client.phone}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{client.email}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Endereço
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{client.address}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Cliente desde</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(client.createdAt).toLocaleDateString('pt-BR')}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Máquinas do Cliente</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
            Nova Máquina
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clientMachines.map((machine) => (
            <div key={machine.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-primary-600" />
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{machine.name}</h4>
                    <p className="text-sm text-gray-500">Modelo: {machine.model}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Número de Série: {machine.serialNumber}</p>
                  <p className="text-sm text-gray-600">
                    Data de Aquisição: {new Date(machine.acquisitionDate).toLocaleDateString('pt-BR')}
                  </p>
                  {machine.hourMeter && (
                    <p className="text-sm text-gray-600">Horímetro: {machine.hourMeter} horas</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;