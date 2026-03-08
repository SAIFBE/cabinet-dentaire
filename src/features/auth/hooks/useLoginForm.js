import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../validation/loginSchema';
import { useAuth } from '../../../security/auth/useAuth';

export function useLoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState('');

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      await login(data);
      // Navigation handled by ProtectedRoute redirect
    } catch (err) {
      // SECURITY: Generic error message — no user enumeration
      setError('Invalid credentials');
    }
  };

  return {
    form,
    error,
    isSubmitting: form.formState.isSubmitting,
    handleSubmit: form.handleSubmit(onSubmit),
  };
}
