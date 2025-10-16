import { useState } from 'react';
import { resetPassword } from '../services/authService';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await resetPassword(email);
    if (!error) alert('Password reset link sent!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">Reset Password</h1>
      <FormInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required />
      <FormButton type="submit">Send Reset Link</FormButton>
    </form>
  );
};

export default ForgotPassword;
