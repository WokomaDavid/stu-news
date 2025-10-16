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

    const { data, error } = await supabase.auth.admin.createUser({
      email: form.email,
      password: form.password,
      user_metadata: { name: form.name },
    });

    if (!error) {
      const { error: insertErr } = await supabase.from('admins').insert([{ id: data.user.id, email: form.email, name: form.name }]);
      if (insertErr) {
        console.error('insert admin row error', insertErr);
        alert('Admin created but DB insert failed: ' + (insertErr.message || JSON.stringify(insertErr)));
      } else {
        alert('Admin registered!');
        try {
          await logAction(user?.id || null, 'register_admin', data.user.id, { email: form.email, name: form.name });
        } catch (err) { console.warn('logAction failed', err); }
      }
    } else {
      console.error('createUser error', error);
      alert('Error creating admin: ' + (error.message || JSON.stringify(error)));
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
