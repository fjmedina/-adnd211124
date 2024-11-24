import { createClient } from '@supabase/supabase-js';

// Configuración usando variables de entorno
export const supabaseUrl = process.env.SUPABASE_URL!;
export const supabaseKey = process.env.SUPABASE_KEY!;

// Verificación para evitar problemas si faltan claves
if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL o SUPABASE_KEY no están configurados.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize admin user if it doesn't exist (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  const initAdminUser = async () => {
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('email', 'pancho@advertisingnotdead.cl')
      .single();

    if (!existingUser) {
      const { data: { user }, error } = await supabase.auth.signUp({
        email: 'pancho@advertisingnotdead.cl',
        password: 'AND2024!',
      });

      if (!error && user) {
        await supabase.from('users').insert([
          {
            id: user.id,
            email: user.email,
            role: 'admin',
          },
        ]);
      } else if (error) {
        console.error('Error al crear el usuario admin:', error.message);
      }
    }
  };

  initAdminUser().catch((error) =>
    console.error('Error inicializando admin user:', error.message)
  );
}

// Interfaces
export interface Case {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'converted' | 'archived';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  created_at: string;
}

// Funciones de autenticación
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error('Error al iniciar sesión:', error.message);
    throw error;
  }
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error.message);
    throw error;
  }
};

// Funciones relacionadas con `cases`
export const getCases = async () => {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createCase = async (caseData: Omit<Case, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('cases')
    .insert([caseData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Funciones relacionadas con `leads`
export const getLeads = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateLeadStatus = async (id: string, status: Lead['status']) => {
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Funciones relacionadas con `users`
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createUser = async (userData: Omit<User, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  if (error) throw error;
  return data;
};
