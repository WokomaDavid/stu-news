import { useEffect, useState } from 'react';
import { addStudent, updateStudent, deleteStudent, fetchStudents } from '../services/studentService';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import AdminHeader from './AdminHeader';
import { useAuth } from '../context/AuthContext';
import { logAction } from '../services/announcementService';

const ManageStudents = () => {
  const [form, setForm] = useState({ name: '', reg_number: '' });
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await fetchStudents();
      setList(data || []);
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { data, error } = await updateStudent(editingId, form);
      if (!error) {
        alert('Student updated');
        try { await logAction(user?.id || null, 'update_student', editingId, { ...form }); } catch (err) { console.warn('logAction failed', err); }
        setList((prev) => prev.map((s) => (s.id === editingId ? (Array.isArray(data) ? data[0] : data) : s)));
        setEditingId(null);
        setForm({ name: '', reg_number: '' });
      } else {
        console.error('updateStudent error', error);
        alert('Update failed: ' + (error.message || JSON.stringify(error)));
      }
    } else {
      const { data, error } = await addStudent(form);
      if (!error) {
        alert('Student added!');
        try { await logAction(user?.id || null, 'add_student', form.reg_number, { reg_number: form.reg_number, name: form.name }); } catch (err) { console.warn('logAction failed', err); }
        setForm({ name: '', reg_number: '' });
        setList((prev) => [ ...(Array.isArray(data) ? data : [data]), ...prev ]);
      } else {
        console.error('addStudent error', error);
        alert('Add failed: ' + (error.message || JSON.stringify(error)));
      }
    }
  };

  const { user } = useAuth();

  // log student addition
  if (!user) {
    // not logged in — proceed but logging will be null actor
    // eslint-disable-next-line no-console
    console.debug('ManageStudents: no authenticated user present; actions will be logged with null actor');
  }


  return (
    <div className="p-4">
      <AdminHeader title="Manage Students" />
      <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-lg">
        <FormInput name="name" label="Student Name" placeholder="Student Name" value={form.name} onChange={handleChange} required />
        <FormInput name="reg_number" label="Reg Number" placeholder="Reg Number" value={form.reg_number} onChange={handleChange} required />
        <FormButton type="submit">{editingId ? 'Update Student' : 'Add Student'}</FormButton>
      </form>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Students</h2>
        <ul className="space-y-2">
          {list.map((s) => (
            <li key={s.id} className="p-2 border rounded bg-white dark:bg-gray-800 flex justify-between items-center">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-gray-500">Reg: {s.reg_number}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditingId(s.id); setForm({ name: s.name, reg_number: s.reg_number }); window.scrollTo({ top: 0, behavior: 'smooth'}); }} className="text-sm text-primary">Edit</button>
                <button onClick={async () => { if (!confirm('Delete student?')) return; const { error } = await deleteStudent(s.id); if (!error) { try { await logAction(user?.id || null, 'delete_student', s.id, { reg_number: s.reg_number }); } catch (err) { console.warn('logAction failed', err); } setList((prev) => prev.filter((x) => x.id !== s.id)); alert('Deleted'); } else { console.error('deleteStudent error', error); alert('Delete failed: ' + (error.message || JSON.stringify(error))); } }} className="text-sm text-red-500">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageStudents;
