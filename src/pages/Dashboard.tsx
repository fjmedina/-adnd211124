import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings,
  Mail,
  LogOut
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { supabase } from '../lib/supabase';
import CasesManager from '../components/dashboard/CasesManager';
import LeadsManager from '../components/dashboard/LeadsManager';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalCases: 0,
    totalUsers: 0
  });

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    }
    setIsLoading(false);
  };

  const loadDashboardData = async () => {
    try {
      const [leads, cases, users] = await Promise.all([
        supabase.from('leads').select('count'),
        supabase.from('cases').select('count'),
        supabase.from('users').select('count')
      ]);

      setStats({
        totalLeads: leads.count || 0,
        totalCases: cases.count || 0,
        totalUsers: users.count || 0
      });
    } catch (error) {
      toast.error('Error al cargar los datos del dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'cases':
        return <CasesManager />;
      case 'leads':
        return <LeadsManager />;
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Leads', value: stats.totalLeads, icon: Users },
              { label: 'Casos Publicados', value: stats.totalCases, icon: FileText },
              { label: 'Usuarios', value: stats.totalUsers, icon: Users }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600">
              Sección en desarrollo...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen shadow-lg fixed">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">AND Admin</h2>
          </div>
          
          <nav className="mt-6">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Vista General' },
              { id: 'leads', icon: Users, label: 'Leads' },
              { id: 'cases', icon: FileText, label: 'Casos' },
              { id: 'messages', icon: Mail, label: 'Mensajes' },
              { id: 'settings', icon: Settings, label: 'Configuración' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors ${
                  activeTab === item.id ? 'text-blue-600 bg-blue-50' : ''
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 w-full p-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;