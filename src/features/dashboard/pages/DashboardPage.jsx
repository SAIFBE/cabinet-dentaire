import { useState, useEffect } from 'react';
import { useAuth } from '../../../security/auth/useAuth';
import { useTranslation } from 'react-i18next';
import { mockServer } from '../../../services/api/mockServer';
import { Spinner } from '../../../shared/components/Spinner';
import { Card } from '../../../shared/components/Card';
import { Alert } from '../../../shared/components/Alert';
import { formatDate } from '../../../lib/utils';
import { Users, CalendarDays, Receipt, AlertTriangle } from 'lucide-react';
import { randomDelay } from '../../../lib/utils';

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await randomDelay();
        const data = mockServer.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [t]);

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">
            {t('dashboard.welcome')} {user?.name?.split(' ')[0] || 'Docteur'}
          </h2>
          <p className="page-header__subtitle">{t('dashboard.subtitle')}</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card kpi-card--highlight">
          <div className="kpi-card__icon kpi-card__icon--primary"><Users size={22} /></div>
          <div>
            <div className="kpi-card__value">{stats.totalPatients}</div>
            <div className="kpi-card__label">{t('dashboard.totalPatients')}</div>
          </div>
        </div>
        <div className="kpi-card kpi-card--highlight">
          <div className="kpi-card__icon kpi-card__icon--info"><CalendarDays size={22} /></div>
          <div>
            <div className="kpi-card__value">{stats.todayAppointments}</div>
            <div className="kpi-card__label">{t('dashboard.todayAppointments')}</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__icon kpi-card__icon--warning"><Receipt size={22} /></div>
          <div>
            <div className="kpi-card__value">{stats.pendingInvoices}</div>
            <div className="kpi-card__label">{t('dashboard.pendingInvoices')}</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__icon kpi-card__icon--success"><AlertTriangle size={22} /></div>
          <div>
            <div className="kpi-card__value">{stats.lowStockItems}</div>
            <div className="kpi-card__label">{t('dashboard.lowStockAlerts')}</div>
          </div>
        </div>
      </div>

      <Card title={t('dashboard.latestAppointments')}>
        {stats.recentAppointments && stats.recentAppointments.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('common.patient')}</th>
                <th>{t('common.date')}</th>
                <th>{t('common.time')}</th>
                <th>{t('common.type')}</th>
                <th>{t('common.status')}</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentAppointments.map((apt) => (
                <tr key={apt.id}>
                  <td style={{ fontWeight: 500 }}>{apt.patientName}</td>
                  <td>{formatDate(apt.date)}</td>
                  <td>{apt.time}</td>
                  <td>{t(`appointmentTypes.${apt.type}`, apt.type)}</td>
                  <td>
                    <span className={`badge badge--${apt.status === 'completed' ? 'success' : apt.status === 'cancelled' ? 'danger' : 'info'}`}>
                      {t(`statuses.${apt.status}`, apt.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p className="empty-state__text">{t('dashboard.noAppointments')}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
