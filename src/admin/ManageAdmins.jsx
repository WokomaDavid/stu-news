import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import AdminHeader from './AdminHeader';
import { useAuth } from '../context/AuthContext';
import { logAction } from '../services/announcementService';

const ManageAdmins = () => {
  const [form, setForm] = useState({ email: '', password: '', name: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // call serverless endpoint
    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.access_token || null;

    try {
      const resp = await fetch('/api/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ email: form.email, password: form.password, name: form.name }),
      });

      const json = await resp.json();
      if (!resp.ok) {
        console.error('create-admin API error', json);
        alert('Error creating admin: ' + (json?.error?.message || json?.error || JSON.stringify(json)));
        return;
      }

      alert('Admin registered!');
      try { await logAction(user?.id || null, 'register_admin', json.id, { email: form.email, name: form.name }); } catch (err) { console.warn('logAction failed', err); }
      setForm({ email: '', password: '', name: '' });
    } catch (err) {
      console.error('create-admin request failed', err);
      alert('Create admin request failed: ' + String(err));
    }
  };

  const { user } = useAuth();

  return (
    <div className="p-4">
      <AdminHeader title="Manage Admins" />
      <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-lg">
        <FormInput name="name" label="Full Name" value={form.name} onChange={handleChange} required />
        <FormInput name="email" label="Email" type="email" value={form.email} onChange={handleChange} required />
        <FormInput name="password" label="Password" type="password" value={form.password} onChange={handleChange} required />
        <FormButton type="submit">Register Admin</FormButton>
      </form>
    </div>
  );
};

export default ManageAdmins;
