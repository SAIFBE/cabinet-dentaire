import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { appointmentsApi } from '../../../services/api/appointmentsApi';
import { AppointmentForm } from '../components/AppointmentForm';
import { Button } from '../../../shared/components/Button';
import { Spinner } from '../../../shared/components/Spinner';
import { Alert } from '../../../shared/components/Alert';
import { Card } from '../../../shared/components/Card';
import { formatDate } from '../../../lib/utils';
import { Plus, X, CalendarDays } from 'lucide-react';

export function AppointmentsPage() {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadAppointments = useCallback(async () => {
    try {
      setError('');
      const data = await appointmentsApi.getAll();
      setAppointments(data);
    } catch { setError(t('appointments.loadError')); }
    finally { setLoading(false); }
  }, [t]);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  const handleCreate = async (data) => {
    try {
      await appointmentsApi.create(data);
      setShowModal(false);
      loadAppointments();
    } catch { setError(t('appointments.createError')); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">{t('appointments.title')}</h2>
          <p className="page-header__subtitle">{t('appointments.subtitle')}</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} /> {t('appointments.newAppointment')}
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Card>
        {appointments.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('common.patient')}</th>
                <th>{t('common.date')}</th>
                <th>{t('common.time')}</th>
                <th>{t('common.type')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.notes')}</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
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
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{apt.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <CalendarDays size={40} className="empty-state__icon" />
            <p className="empty-state__title">{t('appointments.noAppointments')}</p>
            <p className="empty-state__text">{t('appointments.noAppointmentsSub')}</p>
          </div>
        )}
      </Card>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">{t('appointments.newAppointment')}</h3>
              <button className="modal__close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal__body">
              <AppointmentForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
