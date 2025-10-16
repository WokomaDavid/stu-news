import { useEffect, useState } from 'react';
import { createAnnouncement, uploadFile, logAction, fetchAnnouncements, updateAnnouncement, deleteAnnouncement } from '../services/announcementService';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import FormTextarea from '../components/FormTextarea';
import AdminHeader from './AdminHeader';
import { useAuth } from '../context/AuthContext';

const ManageAnnouncements = () => {
  const [form, setForm] = useState({ title: '', summary: '', content: '', file: null });
  const [editingId, setEditingId] = useState(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await fetchAnnouncements();
      setList(data || []);
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let file_url = null;
    if (form.file) {
      const res = await uploadFile(form.file);
      if (res?.error) {
        console.error('File upload error', res.error);
        alert('File upload failed: ' + (res.error.message || JSON.stringify(res.error)));
        return;
      }
      if (res?.url) file_url = res.url;
    }
    const announcement = {
      title: form.title,
      summary: form.summary,
      content: form.content,
      file_url,
    };

    if (editingId) {
      const { data, error } = await updateAnnouncement(editingId, announcement);
      if (!error) {
        alert('Announcement updated');
    try { await logAction(user?.id || null, 'update_announcement', editingId, { title: announcement.title }); } catch (err) { console.warn('logAction failed', err); }
        setList((prev) => prev.map((r) => (r.id === editingId ? (Array.isArray(data) ? data[0] : data) : r)));
        setEditingId(null);
        setForm({ title: '', summary: '', content: '', file: null });
      } else {
        console.error('updateAnnouncement error', error);
        alert('Failed to update announcement: ' + (error.message || JSON.stringify(error)));
      }
    } else {
      const { data, error } = await createAnnouncement(announcement);
      if (!error) {
        try {
          const created = Array.isArray(data) ? data[0] : data;
          await logAction(user?.id || null, 'create_announcement', created?.id || null, { title: created?.title });
        } catch (err) { console.warn('logAction failed', err); }
        alert('Announcement created!');
        setForm({ title: '', summary: '', content: '', file: null });
        setList((prev) => [ ...(Array.isArray(data) ? data : [data]), ...prev ]);
      } else {
        console.error('createAnnouncement error', error);
        alert('Failed to create announcement: ' + (error.message || JSON.stringify(error)));
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ title: item.title || '', summary: item.summary || '', content: item.content || '', file: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement? This cannot be undone.')) return;
    const { data, error } = await deleteAnnouncement(id);
    if (!error) {
      try { await logAction(user?.id || null, 'delete_announcement', id, {}); } catch (err) { console.warn('logAction failed', err); }
      setList((prev) => prev.filter((r) => r.id !== id));
      alert('Deleted');
    } else {
      console.error('deleteAnnouncement error', error);
      alert('Delete failed: ' + (error.message || JSON.stringify(error)));
    }
  };

  return (
    <div className="p-4">
      <AdminHeader title="Manage Announcements" />
      <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-2xl">
        <FormInput name="title" label="Title" value={form.title} onChange={handleChange} required />
        <FormInput name="summary" label="Summary" value={form.summary} onChange={handleChange} />
        <FormTextarea name="content" label="Full Content" value={form.content} onChange={handleChange} required />
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">Attachment</label>
          <input type="file" onChange={handleFileChange} className="mt-1" />
        </div>
        <FormButton type="submit">{editingId ? 'Update Announcement' : 'Create Announcement'}</FormButton>
      </form>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Existing Announcements</h2>
        <ul className="space-y-3">
          {list.map((item) => (
            <li key={item.id} className="p-3 border rounded bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(item)} className="text-sm text-primary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-sm text-red-500 hover:underline">Delete</button>
                </div>
              </div>
              {item.summary && <p className="mt-2 text-sm text-gray-600">{item.summary}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageAnnouncements;
