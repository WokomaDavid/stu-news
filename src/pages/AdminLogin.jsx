import { useState } from 'react';
import { loginAdmin } from '../services/authService';
import { useNavigate } from 'react-router-dom';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await loginAdmin(email, password);
    if (!error) navigate('/admin/dashboard');
    else alert('Login failed');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Admin Login</h1>
      <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
      <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
      <FormButton type="submit" className="w-full">Sign In</FormButton>
    </form>
  );
};

export default AdminLogin;
