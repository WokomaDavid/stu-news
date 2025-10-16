import { supabase } from './supabaseClient';

export const addStudent = async (student) => {
  const { data, error } = await supabase.from('students').insert([student]);
  return { data, error };
};

export const updateStudent = async (id, student) => {
  const { data, error } = await supabase.from('students').update(student).eq('id', id);
  return { data, error };
};

export const deleteStudent = async (id) => {
  const { data, error } = await supabase.from('students').delete().eq('id', id);
  return { data, error };
};

export const getStudentByReg = async (reg_number) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('reg_number', reg_number)
    .single();
  return { data, error };
};

export const fetchStudents = async () => {
  const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
  return { data, error };
};
