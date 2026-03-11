import { useAuth } from '../../security/auth/useAuth';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Menu } from 'lucide-react';

const pageTitleKeys = {
  '/dashboard': 'topbar.dashboard',
  '/patients': 'topbar.patients',
  '/appointments': 'topbar.appointments',
  '/waiting-room': 'topbar.waitingRoom',
  '/billing': 'topbar.billing',
  '/stock': 'topbar.stock',
  '/dental-chart': 'topbar.dentalChart',
  '/radiology': 'topbar.radiology',
  '/prescriptions': 'topbar.prescriptions',
  '/medical-records': 'topbar.medicalRecords',
  '/reports': 'topbar.reports',
  '/settings': 'topbar.settings',
};

export function Topbar({ onMenuClick }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();

  const titleKey = pageTitleKeys[location.pathname];
  const title = titleKey ? t(titleKey) : 'Dentisafe';

  return (
    <header className="app-layout__topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          className="topbar__menu-btn btn--icon" 
          onClick={onMenuClick}
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="topbar__title">{title}</h1>
      </div>
      <div className="topbar__actions">
        <button className="topbar__logout" onClick={logout}>
          <LogOut size={16} />
          {t('topbar.logout')}
        </button>
      </div>
    </header>
  );
}
