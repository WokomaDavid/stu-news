import { useEffect, useState } from 'react';
import { addResult, fetchResults, updateResult, deleteResult } from '../services/resultService';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import AdminHeader from './AdminHeader';
import { useAuth } from '../context/AuthContext';
import { logAction } from '../services/announcementService';

const ManageResults = () => {
  const [form, setForm] = useState({ student_id: '', subject: '', score: '' });
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, score: parseInt(form.score) };
    if (editingId) {
      const { error } = await updateResult(editingId, payload);
      if (!error) {
        alert('Result updated!');
        try {
          await logAction(user?.id || null, 'update_result', editingId, { ...payload });
        } catch (err) { console.warn('logAction failed', err); }
        setForm({ student_id: '', subject: '', score: '' });
        setEditingId(null);
        await loadResults();
      } else {
        console.error('updateResult error', error);
        alert('Update failed: ' + (error.message || JSON.stringify(error)));
      }
    } else {
      const { error } = await addResult(payload);
      if (!error) {
        alert('Result added!');
        try {
          await logAction(user?.id || null, 'add_result', null, { student_id: form.student_id, subject: form.subject });
        } catch (err) { console.warn('logAction failed', err); }
        setForm({ student_id: '', subject: '', score: '' });
        await loadResults();
      } else {
        console.error('addResult error', error);
        alert('Add failed: ' + (error.message || JSON.stringify(error)));
      }
    }
  };

  const { user } = useAuth();

  const loadResults = async () => {
    const { data, error } = await fetchResults();
    if (!error && data) setList(data);
  };

  useEffect(() => {
    loadResults();
  }, []);

  const handleEdit = (r) => {
    setEditingId(r.id);
    setForm({ student_id: r.student_id || '', subject: r.subject || '', score: r.score?.toString() || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (r) => {
    if (!confirm('Delete this result?')) return;
    const { error } = await deleteResult(r.id);
    if (!error) {
  try { await logAction(user?.id || null, 'delete_result', r.id, { student_id: r.student_id, subject: r.subject }); } catch (err) { console.warn('logAction failed', err); }
      await loadResults();
    } else {
      console.error('deleteResult error', error);
      alert('Delete failed: ' + (error.message || JSON.stringify(error)));
    }
  };

  return (
    <div className="p-4">
      <AdminHeader title="Manage Results" />
      <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-lg">
        <FormInput name="student_id" label="Student ID" value={form.student_id} onChange={handleChange} required />
        <FormInput name="subject" label="Subject" value={form.subject} onChange={handleChange} required />
        <FormInput name="score" label="Score" type="number" value={form.score} onChange={handleChange} required />
        <div className="flex items-center gap-2">
          <FormButton type="submit">{editingId ? 'Update Result' : 'Add Result'}</FormButton>
          {editingId && (
            <button type="button" className="text-sm text-gray-500" onClick={() => { setEditingId(null); setForm({ student_id: '', subject: '', score: '' }); }}>Cancel</button>
          )}
        </div>
      </form>

      <div className="p-4">
        <h3 className="font-semibold mb-2">Existing Results</h3>
        <div className="space-y-2">
          {list.map((r) => (
            <div key={r.id} className="p-3 border rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{r.subject} — Student: {r.student_id}</div>
                <div className="text-sm text-gray-600">Score: {r.score}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-sm text-blue-600" onClick={() => handleEdit(r)}>Edit</button>
                <button className="text-sm text-red-600" onClick={() => handleDelete(r)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageResults;
