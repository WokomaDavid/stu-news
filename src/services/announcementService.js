import { supabase } from './supabaseClient';

export const uploadFile = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage
    .from('announcement-files')
    .upload(fileName, file);

  if (error) return { error };

  const { publicUrl } = supabase.storage
    .from('announcement-files')
    .getPublicUrl(fileName);

  return { url: publicUrl };
};

export const createAnnouncement = async (announcement) => {
  const { data, error } = await supabase.from('announcements').insert([announcement]);
  return { data, error };
};

export const updateAnnouncement = async (id, announcement) => {
  const { data, error } = await supabase.from('announcements').update(announcement).eq('id', id);
  return { data, error };
};

export const deleteAnnouncement = async (id) => {
  const { data, error } = await supabase.from('announcements').delete().eq('id', id);
  return { data, error };
};


export const fetchActiveAnnouncements = async () => {
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .gte('created_at', twoWeeksAgo)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const fetchArchivedAnnouncements = async () => {
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .lt('created_at', twoWeeksAgo)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const logAction = async (actor_id, action, target, metadata = {}) => {
  await supabase.from('audit_logs').insert([{ actor_id, action, target, metadata }]);
};

// Backwards-compatible alias used by pages: returns active (recent) announcements
export const fetchAnnouncements = async () => {
  return fetchActiveAnnouncements();
};

export const getAnnouncementById = async (id) => {
  // Defensive: don't call Supabase with an invalid id (e.g. undefined or the string 'undefined')
  if (id === undefined || id === null) {
    return { data: null, error: new Error('invalid id') };
  }
  // If route params accidentally pass the string 'undefined' or 'null', treat as invalid
  if (String(id).toLowerCase() === 'undefined' || String(id).toLowerCase() === 'null') {
    return { data: null, error: new Error('invalid id') };
  }

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

