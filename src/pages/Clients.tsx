import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Phone, Mail, MapPin } from 'lucide-react';
import { mockClients } from '../mock/data';

const Clients: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => navigate('/clients/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Novo Cliente
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockClients.map((client) => (
          <Link
            key={client.id}
            to={`/clients/${client.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">{client.name}</h2>
                  <p className="text-sm text-gray-500">CNPJ: {client.cnpj}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  {client.phone}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  {client.email}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  {client.address}
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Contato: {client.contactPerson}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Cliente desde: {new Date(client.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Clients;