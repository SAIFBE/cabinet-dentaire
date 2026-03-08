import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';

// Feature pages
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';
import { PatientsPage } from '../../features/patients/pages/PatientsPage';
import { PatientDetailsPage } from '../../features/patients/pages/PatientDetailsPage';
import { AppointmentsPage } from '../../features/appointments/pages/AppointmentsPage';
import { WaitingRoomPage } from '../../features/waitingRoom/pages/WaitingRoomPage';
import { BillingPage } from '../../features/billing/pages/BillingPage';
import { InvoiceDetailsPage } from '../../features/billing/pages/InvoiceDetailsPage';
import { StockPage } from '../../features/stock/pages/StockPage';
import { SettingsPage } from '../../features/settings/pages/SettingsPage';
import { DentalChartPage } from '../../features/dentalChart/pages/DentalChartPage';
import { RadiologyPage } from '../../features/radiology/pages/RadiologyPage';
import { PrescriptionsPage } from '../../features/prescriptions/pages/PrescriptionsPage';
import { MedicalRecordsPage } from '../../features/medicalRecords/pages/MedicalRecordsPage';
import { ReportsPage } from '../../features/reports/pages/ReportsPage';

export const router = createBrowserRouter([
  // Public route
  {
    path: '/login',
    element: <LoginPage />,
  },

  // Protected routes (require authentication)
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/patients', element: <PatientsPage /> },
      { path: '/patients/:id', element: <PatientDetailsPage /> },
      { path: '/appointments', element: <AppointmentsPage /> },
      { path: '/waiting-room', element: <WaitingRoomPage /> },
      { path: '/billing', element: <BillingPage /> },
      { path: '/billing/:id', element: <InvoiceDetailsPage /> },
      { path: '/stock', element: <StockPage /> },

      // Clinical: admin + assistant (secretary blocked for dental chart)
      {
        path: '/dental-chart',
        element: (
          <RoleGuard allowedRoles={['admin', 'assistant']}>
            <DentalChartPage />
          </RoleGuard>
        ),
      },

      // Radiology: all roles can access (RBAC handled in component)
      { path: '/radiology', element: <RadiologyPage /> },
      { path: '/patients/:id/radiology', element: <RadiologyPage /> },

      // Prescriptions: all roles can access (RBAC handled in component)
      { path: '/prescriptions', element: <PrescriptionsPage /> },
      { path: '/patients/:id/prescriptions', element: <PrescriptionsPage /> },

      // Medical Records: all roles can access (RBAC handled in component)
      { path: '/medical-records', element: <MedicalRecordsPage /> },
      { path: '/patients/:id/medical-records', element: <MedicalRecordsPage /> },

      // Reports: all roles can access (RBAC limits visible data per role)
      { path: '/reports', element: <ReportsPage /> },

      // Admin-only route (RBAC enforcement)
      {
        path: '/settings',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <SettingsPage />
          </RoleGuard>
        ),
      },
    ],
  },

  // Catch-all: redirect to dashboard
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
