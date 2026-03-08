import { useState, useEffect } from 'react';
import { useAuth } from '../../../security/auth/useAuth';
import { useTranslation } from 'react-i18next';
import { reportsApi } from '../../../services/api/reportsApi';
import { RevenueChart } from '../components/RevenueChart';
import { AppointmentsChart } from '../components/AppointmentsChart';
import { PatientsStats } from '../components/PatientsStats';
import { Spinner } from '../../../shared/components/Spinner';
import { Alert } from '../../../shared/components/Alert';
import { Button } from '../../../shared/components/Button';
import { formatMAD } from '../../../utils/currency';
import { RefreshCw, Banknote, Users, CalendarCheck, FileText } from 'lucide-react';

export function ReportsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin';
  const isSecretary = user?.role === 'secretary';
  const showFinancial = isAdmin || isSecretary;
  const showFull = isAdmin;

  const loadData = async () => {
    setLoading(true); setError('');
    try { const result = await reportsApi.getData(); setData(result); }
    catch { setError(t('reports.loadError')); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">{t('reports.title')}</h2>
          <p className="page-header__subtitle">{t('reports.subtitle')}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={loadData}><RefreshCw size={14} /> {t('common.refresh')}</Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {data && (
        <>
          <div className="kpi-grid">
            {showFinancial && (
              <>
                <div className="kpi-card kpi-card--highlight">
                  <div className="kpi-card__icon kpi-card__icon--success"><Banknote size={22} /></div>
                  <div><div className="kpi-card__value">{formatMAD(data.paidRevenue)}</div><div className="kpi-card__label">{t('reports.paidRevenue')}</div></div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-card__icon kpi-card__icon--warning"><Banknote size={22} /></div>
                  <div><div className="kpi-card__value">{formatMAD(data.unpaidRevenue)}</div><div className="kpi-card__label">{t('reports.unpaid')}</div></div>
                </div>
              </>
            )}
            <div className="kpi-card">
              <div className="kpi-card__icon kpi-card__icon--primary"><Users size={22} /></div>
              <div><div className="kpi-card__value">{data.totalPatients}</div><div className="kpi-card__label">{t('reports.totalPatients')}</div></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-card__icon kpi-card__icon--info"><CalendarCheck size={22} /></div>
              <div><div className="kpi-card__value">{data.totalAppointments}</div><div className="kpi-card__label">{t('reports.totalAppointments')}</div></div>
            </div>
            {showFull && (
              <div className="kpi-card">
                <div className="kpi-card__icon kpi-card__icon--warning"><FileText size={22} /></div>
                <div><div className="kpi-card__value">{data.recentPrescriptions}</div><div className="kpi-card__label">{t('reports.prescriptionsCount')}</div></div>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: showFinancial ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '20px' }}>
            {showFinancial && <RevenueChart data={data.monthlyRevenue} />}
            <AppointmentsChart data={data.weeklyAppointments} />
          </div>

          {showFull && <PatientsStats treatmentTypes={data.treatmentTypes} lowStockItems={data.lowStockItems} />}
        </>
      )}
    </div>
  );
}
