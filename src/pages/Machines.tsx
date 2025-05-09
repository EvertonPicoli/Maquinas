import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Search, Filter, Users } from 'lucide-react';
import { mockMachines, mockClients } from '../mock/data';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

const Machines: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter machines based on user role and client ID
  const userMachines = user?.role === 'client'
    ? mockMachines.filter(machine => machine.clientId === user.id)
    : mockMachines;

  const filteredMachines = userMachines.filter(machine => {
    const matchesSearch = machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || machine.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Máquinas</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => navigate('/machines/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Nova Máquina
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Buscar máquinas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="operational">Operacional</option>
              <option value="maintenance">Em manutenção</option>
              <option value="inactive">Inativa</option>
            </select>
          </div>
        </div>

        {/* Machines Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMachines.map((machine) => {
            const client = mockClients.find(c => c.id === machine.clientId);
            
            return (
              <Link
                key={machine.id}
                to={`/machines/${machine.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building className="h-8 w-8 text-primary-600" />
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">{machine.name}</h2>
                        <p className="text-sm text-gray-500">Modelo: {machine.model}</p>
                      </div>
                    </div>
                    <StatusBadge status={machine.status} />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {user?.role === 'admin' && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <span className="truncate">{client?.name}</span>
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      Série: {machine.serialNumber}
                    </p>
                    {machine.hourMeter && (
                      <p className="text-sm text-gray-500">
                        Horímetro: {machine.hourMeter} horas
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-400">
                    Aquisição: {new Date(machine.acquisitionDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredMachines.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma máquina encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar os filtros ou criar uma nova máquina.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Machines;