import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { appointmentsApi } from '../../../services/api/appointmentsApi';
import { patientsApi } from '../../../services/api/patientsApi';
import { Button } from '../../../shared/components/Button';
import { Spinner } from '../../../shared/components/Spinner';
import { Alert } from '../../../shared/components/Alert';
import { Card } from '../../../shared/components/Card';
import { Clock, LogOut as CheckOutIcon, UserPlus } from 'lucide-react';

export function WaitingRoomPage() {
  const { t } = useTranslation();
  const [queue, setQueue] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);

  const loadWaitingRoom = useCallback(async () => {
    try {
      setError('');
      const data = await appointmentsApi.getWaitingRoom();
      setQueue(data);
    } catch { setError(t('waitingRoom.loadError')); }
    finally { setLoading(false); }
  }, [t]);

  useEffect(() => {
    loadWaitingRoom();
    patientsApi.getAll().then(setPatients).catch(() => {});
  }, [loadWaitingRoom]);

  const handleCheckOut = async (id) => {
    try {
      await appointmentsApi.checkOut(id);
      loadWaitingRoom();
    } catch { setError(t('waitingRoom.checkOutError')); }
  };

  const handleCheckIn = async () => {
    if (!selectedPatientId) return;

    // Duplicate check
    const alreadyInQueue = queue.find(
      (w) => w.patientId === selectedPatientId && w.status !== 'done'
    );
    if (alreadyInQueue) {
      setError('Ce patient est déjà dans la salle d\'attente.');
      return;
    }

    const patient = patients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    try {
      setCheckingIn(true);
      const now = new Date();
      const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      await appointmentsApi.checkIn(
        patient.id,
        `${patient.firstName} ${patient.lastName}`,
        timeStr
      );
      setSelectedPatientId('');
      loadWaitingRoom();
    } catch {
      setError(t('waitingRoom.checkInError'));
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">{t('waitingRoom.title')}</h2>
          <p className="page-header__subtitle">{t('waitingRoom.patientsWaiting', { count: queue.length })}</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Check-in form */}
      <Card>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
            <label className="form-label">Patient</label>
            <select
              className="form-input"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              <option value="">— Sélectionner un patient —</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} — {p.phone || ''}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleCheckIn} disabled={!selectedPatientId || checkingIn}>
            <UserPlus size={16} /> Arrivé / Check-in
          </Button>
        </div>
      </Card>

      {queue.length > 0 ? (
        <div className="queue-list" style={{ marginTop: '20px' }}>
          {queue.map((item, index) => (
            <div key={item.id} className="queue-item">
              <div className="queue-item__info">
                <div className="queue-item__number">{index + 1}</div>
                <div>
                  <div className="queue-item__name">{item.patientName}</div>
                  <div className="queue-item__time">
                    {t('waitingRoom.appointment')} : {item.appointmentTime} · {t('waitingRoom.checkedIn')} : {new Date(item.checkedInAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge badge--${item.status === 'waiting' ? 'warning' : 'info'}`}>
                  {t(`statuses.${item.status}`, item.status)}
                </span>
                <Button variant="ghost" size="sm" onClick={() => handleCheckOut(item.id)}>
                  <CheckOutIcon size={14} /> {t('waitingRoom.checkOut')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ marginTop: '20px', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <Clock size={40} className="empty-state__icon" />
          <p className="empty-state__title">{t('waitingRoom.emptyTitle')}</p>
          <p className="empty-state__text">{t('waitingRoom.emptySub')}</p>
        </div>
      )}
    </div>
  );
}
