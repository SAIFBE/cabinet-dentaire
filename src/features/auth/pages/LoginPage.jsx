import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../security/auth/useAuth';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../components/LoginForm';
import { Stethoscope } from 'lucide-react';
import logo1 from '../../../assets/logo1.png';
import logo2 from '../../../assets/logo2.png';
export function LoginPage() {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__brand">
          <div className="login-card__logo">
            <img src={logo1} alt="Logo" className="sidebar__brand-logo" />
          </div>
          <h1 className="login-card__title">{t('auth.title')}</h1>
          <p className="login-card__subtitle">{t('auth.subtitle')}</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
