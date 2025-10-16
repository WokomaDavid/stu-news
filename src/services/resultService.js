import { supabase } from './supabaseClient';

export const getResultsForStudent = async (student_id) => {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('student_id', student_id);
  return { data, error };
};

export const addResult = async (result) => {
  const { data, error } = await supabase.from('results').insert([result]);
  return { data, error };
};

export const fetchResults = async () => {
  const { data, error } = await supabase.from('results').select('*').order('created_at', { ascending: false });
  return { data, error };
};

export const updateResult = async (id, updates) => {
  if (!id) return { data: null, error: new Error('Invalid id') };
  const { data, error } = await supabase.from('results').update(updates).eq('id', id).select();
  return { data, error };
};

export const deleteResult = async (id) => {
  if (!id) return { data: null, error: new Error('Invalid id') };
  const { data, error } = await supabase.from('results').delete().eq('id', id).select();
  return { data, error };
};
