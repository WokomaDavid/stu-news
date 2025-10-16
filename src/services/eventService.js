import { supabase } from './supabaseClient';

export const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  return { data, error };
};
