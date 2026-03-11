import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../security/auth/useAuth';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Clock,
  Receipt,
  Package,
  Settings,
  Stethoscope,
  ScanLine,
  Image,
  FileText,
  FolderOpen,
  BarChart3,
  X
} from 'lucide-react';
import { getInitials, capitalize } from '../../lib/utils';
import logo1 from '../../assets/logo1.png';
import logo2 from '../../assets/logo2.png';
import { useEffect } from 'react';
import { FeedbackWidget } from '../../shared/components/FeedbackWidget';

const navItems = [
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/patients', labelKey: 'nav.patients', icon: Users },
  { to: '/appointments', labelKey: 'nav.appointments', icon: CalendarDays },
  { to: '/waiting-room', labelKey: 'nav.waitingRoom', icon: Clock },
  { to: '/billing', labelKey: 'nav.billing', icon: Receipt },
  { to: '/stock', labelKey: 'nav.stock', icon: Package },
];

const clinicalItemsRestricted = [
  { to: '/dental-chart', labelKey: 'nav.dentalChart', icon: ScanLine },
];
const clinicalItemsAll = [
  { to: '/radiology', labelKey: 'nav.radiology', icon: Image },
  { to: '/prescriptions', labelKey: 'nav.prescriptions', icon: FileText },
  { to: '/medical-records', labelKey: 'nav.medicalRecords', icon: FolderOpen },
];

const analyticsItems = [
  { to: '/reports', labelKey: 'nav.reports', icon: BarChart3 },
];

const adminItems = [
  { to: '/settings', labelKey: 'nav.settings', icon: Settings },
];

export function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const isAssistant = user?.role === 'assistant';
  const showDentalChart = isAdmin || isAssistant;

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  const renderLinks = (items) =>
    items.map(({ to, labelKey, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        onClick={onClose}
        className={({ isActive }) =>
          `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
        }
      >
        <Icon size={19} />
        {t(labelKey)}
      </NavLink>
    ));

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`app-layout__sidebar ${isOpen ? 'app-layout__sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__brand-name">
            <img src={logo2} alt="Logo" className="sidebar__brand-logo" />
            <button className="sidebar__close-btn btn--icon" onClick={onClose} aria-label="Close sidebar">
              <X size={20} />
            </button>
          </div>
          <div className="sidebar__brand-sub">{t('common.appSubtitle')}</div>
        </div>

      <nav className="sidebar__nav">
        <div className="sidebar__section-label">{t('nav.mainMenu')}</div>
        {renderLinks(navItems)}

        <div className="sidebar__section-label" style={{ marginTop: '8px' }}>
          {t('nav.clinical')}
        </div>
        {showDentalChart && renderLinks(clinicalItemsRestricted)}
        {renderLinks(clinicalItemsAll)}

        <div className="sidebar__section-label" style={{ marginTop: '8px' }}>
          {t('nav.analytics')}
        </div>
        {renderLinks(analyticsItems)}

        {isAdmin && (
          <>
            <div className="sidebar__section-label" style={{ marginTop: '8px' }}>
              {t('nav.administration')}
            </div>
            {renderLinks(adminItems)}
          </>
        )}
      </nav>

      <div style={{ padding: '0 16px 16px 16px' }}>
        <FeedbackWidget />
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">
            {getInitials(user?.name)}
          </div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">{user?.name || 'User'}</div>
            <div className="sidebar__user-role">{capitalize(user?.role)}</div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
