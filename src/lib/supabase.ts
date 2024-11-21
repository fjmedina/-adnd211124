import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://pwhdsfaldvkbjdvbzsyl.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aGRzZmFsZHZrYmpkdmJ6c3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNTMyMDksImV4cCI6MjA0NzcyOTIwOX0.2Scr_ArVhh0Yylw06zIuE9IHTJfLikPneOpTwwleBpc';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize admin user if it doesn't exist
const initAdminUser = async () => {
  const { data: existingUser } = await supabase
    .from('users')
    .select()
    .eq('email', 'admin@advertisingnotdead.com')
    .single();

  if (!existingUser) {
    const { data: { user }, error } = await supabase.auth.signUp({
      email: 'admin@advertisingnotdead.com',
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
    }
  }
};

initAdminUser();

// Rest of the types and functions remain the same...
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

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

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