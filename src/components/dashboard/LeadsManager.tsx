import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Lead, getLeads, updateLeadStatus } from '../../lib/supabase';

const LeadsManager = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (error) {
      toast.error('Error al cargar los leads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Lead['status']) => {
    try {
      await updateLeadStatus(id, status);
      toast.success('Estado actualizado');
      loadLeads();
    } catch (error) {
      toast.error('Error al actualizar el estado');
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
      <h3 className="text-lg font-medium">Gestión de Leads</h3>
      
      <div className="grid gap-6">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold mb-2">{lead.name}</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(lead.created_at).toLocaleDateString()}
                  </div>
                </div>
                <p className="mt-4 text-gray-700">{lead.message}</p>
              </div>
              
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="new">Nuevo</option>
                <option value="contacted">Contactado</option>
                <option value="converted">Convertido</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadsManager;