import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import { toast } from 'sonner';
import { Case, getCases, createCase } from '../../lib/supabase';

const CasesManager = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingCase, setIsAddingCase] = useState(false);
  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    category: '',
    image_url: ''
  });

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const data = await getCases();
      setCases(data);
    } catch (error) {
      toast.error('Error al cargar los casos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCase(newCase);
      toast.success('Caso creado exitosamente');
      setIsAddingCase(false);
      setNewCase({ title: '', description: '', category: '', image_url: '' });
      loadCases();
    } catch (error) {
      toast.error('Error al crear el caso');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Casos de Éxito</h3>
        <button
          onClick={() => setIsAddingCase(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Caso
        </button>
      </div>

      {isAddingCase && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={newCase.title}
              onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <input
              type="text"
              value={newCase.category}
              onChange={(e) => setNewCase({ ...newCase, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">URL de la imagen</label>
            <input
              type="url"
              value={newCase.image_url}
              onChange={(e) => setNewCase({ ...newCase, image_url: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={newCase.description}
              onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAddingCase(false)}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((caseItem) => (
          <div key={caseItem.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="relative h-40 mb-4">
              <img
                src={caseItem.image_url}
                alt={caseItem.title}
                className="w-full h-full object-cover rounded-lg"
              />
              <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                {caseItem.category}
              </span>
            </div>
            <h4 className="font-semibold mb-2">{caseItem.title}</h4>
            <p className="text-gray-600 text-sm mb-4">{caseItem.description}</p>
            <div className="flex justify-end space-x-2">
              <button className="p-2 text-gray-600 hover:text-blue-600">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasesManager;