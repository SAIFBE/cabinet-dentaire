import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../../security/auth/AuthProvider';
import { router } from '../router/routes';

export function AppProviders() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
