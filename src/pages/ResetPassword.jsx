import { useState } from 'react';
import { updatePassword } from '../services/authService';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

const ResetPassword = () => {
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await updatePassword(password);
    if (!error) alert('Password updated!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">Set New Password</h1>
      <FormInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required />
      <FormButton type="submit">Update Password</FormButton>
    </form>
  );
};

export default ResetPassword;
