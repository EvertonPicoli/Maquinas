import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Upload, X } from 'lucide-react';
import { mockClients, mockMachines } from '../mock/data';
import { useAuth } from '../context/AuthContext';

type FileWithPreview = File & {
  preview?: string;
};

const NewMachine: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<FileWithPreview[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    clientId: user?.role === 'client' ? user.id : '',
    name: '',
    model: '',
    serialNumber: '',
    acquisitionDate: '',
    hourMeter: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).map(file => 
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newDocs = Array.from(e.target.files);
      setDocuments(prev => [...prev, ...newDocs]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const newPhotos = [...prev];
      URL.revokeObjectURL(newPhotos[index].preview || '');
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => {
      const newDocs = [...prev];
      newDocs.splice(index, 1);
      return newDocs;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create new machine object
    const newMachine = {
      id: (mockMachines.length + 1).toString(),
      clientId: formData.clientId,
      name: formData.name,
      model: formData.model,
      serialNumber: formData.serialNumber,
      acquisitionDate: formData.acquisitionDate,
      hourMeter: parseInt(formData.hourMeter) || 0,
      status: 'operational' as const,
      documents: documents.map((doc, index) => ({
        id: `doc-${index + 1}`,
        name: doc.name,
        url: '#',
        type: doc.type,
        uploadedAt: new Date().toISOString()
      })),
      photos: photos.map((photo, index) => ({
        id: `photo-${index + 1}`,
        url: photo.preview || '',
        description: `Foto ${index + 1}`,
        uploadedAt: new Date().toISOString()
      }))
    };

    // Add new machine to mock data
    mockMachines.push(newMachine);

    // Navigate back to machines list
    navigate('/machines');
  };

  // Filter clients based on user role
  const availableClients = user?.role === 'client' 
    ? mockClients.filter(client => client.id === user.id)
    : mockClients;

  return (
    <div className="animate-fade-in">
      <div className="pb-5 border-b border-gray-200">
        <div className="flex items-center">
          <Building className="h-8 w-8 text-primary-600" />
          <h1 className="ml-4 text-2xl font-bold text-gray-900">Nova Máquina</h1>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Cadastre uma nova máquina no sistema
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {user?.role === 'admin' && (
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                  Cliente
                </label>
                <select
                  id="clientId"
                  name="clientId"
                  required
                  value={formData.clientId}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                >
                  <option value="">Selecione um cliente</option>
                  {availableClients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={user?.role === 'admin' ? '' : 'sm:col-span-2'}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome da Máquina
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Modelo
              </label>
              <input
                type="text"
                name="model"
                id="model"
                required
                value={formData.model}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                Número de Série
              </label>
              <input
                type="text"
                name="serialNumber"
                id="serialNumber"
                required
                value={formData.serialNumber}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="acquisitionDate" className="block text-sm font-medium text-gray-700">
                Data de Aquisição
              </label>
              <input
                type="date"
                name="acquisitionDate"
                id="acquisitionDate"
                required
                value={formData.acquisitionDate}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="hourMeter" className="block text-sm font-medium text-gray-700">
                Horímetro Inicial
              </label>
              <input
                type="number"
                name="hourMeter"
                id="hourMeter"
                value={formData.hourMeter}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Photos Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Fotos da Máquina</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="photos"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Carregar fotos</span>
                    <input
                      id="photos"
                      name="photos"
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={handlePhotoChange}
                    />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG até 10MB</p>
              </div>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo.preview}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Documentos Técnicos</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="documents"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Carregar documentos</span>
                    <input
                      id="documents"
                      name="documents"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      multiple
                      className="sr-only"
                      onChange={handleDocumentChange}
                    />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC até 10MB</p>
              </div>
            </div>

            {documents.length > 0 && (
              <ul className="divide-y divide-gray-200">
                {documents.map((doc, index) => (
                  <li key={index} className="py-3 flex justify-between items-center">
                    <span className="text-sm text-gray-900">{doc.name}</span>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/machines')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewMachine;