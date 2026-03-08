import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../security/auth/useAuth';
import { useTranslation } from 'react-i18next';
import { patientsApi } from '../../../services/api/patientsApi';
import { dentalChartApi } from '../../../services/api/dentalChartApi';
import { OdontogramGrid } from '../components/OdontogramGrid';
import { ToothModal } from '../components/ToothModal';
import { Spinner } from '../../../shared/components/Spinner';
import { Alert } from '../../../shared/components/Alert';
import { Button } from '../../../shared/components/Button';
import { RefreshCw } from 'lucide-react';

function getAgeCategory(dateOfBirth) {
  if (!dateOfBirth) return 'adult';
  const birth = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  if (age <= 12) return 'child';
  if (age >= 65) return 'senior';
  return 'adult';
}

export function DentalChartPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [chart, setChart] = useState(null);
  const [ageCategory, setAgeCategory] = useState('adult');
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTooth, setSelectedTooth] = useState(null);

  const canEditStatus = user?.role === 'admin';
  const canEditNotes = user?.role === 'admin' || user?.role === 'assistant';

  useEffect(() => {
    const load = async () => {
      try {
        const data = await patientsApi.getAll();
        setPatients(data);
        if (data.length > 0) setSelectedPatientId(data[0].id);
      } catch { setError(t('dentalChart.loadError')); }
      finally { setLoading(false); }
    };
    load();
  }, [t]);

  const loadChart = useCallback(async () => {
    if (!selectedPatientId) return;
    setChartLoading(true);
    setError('');
    try {
      const patient = patients.find((p) => p.id === selectedPatientId);
      const category = getAgeCategory(patient?.dateOfBirth);
      setAgeCategory(category);
      let data = await dentalChartApi.getChartByPatient(selectedPatientId);
      if (!data) data = await dentalChartApi.createChartIfMissing(selectedPatientId, category);
      setChart(data);
    } catch {
      setError(t('dentalChart.loadError'));
      setChart(null);
    } finally { setChartLoading(false); }
  }, [selectedPatientId, patients, t]);

  useEffect(() => { if (selectedPatientId && patients.length > 0) loadChart(); }, [selectedPatientId, patients, loadChart]);

  const handlePatientChange = (e) => { setSelectedPatientId(e.target.value); setChart(null); setSelectedTooth(null); };
  const handleToothClick = (tooth) => setSelectedTooth(tooth);

  const handleToothUpdate = async (toothNumber, patch) => {
    try { await dentalChartApi.updateTooth(selectedPatientId, toothNumber, patch); await loadChart(); setSelectedTooth(null); }
    catch { setError(t('dentalChart.updateError')); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">{t('dentalChart.title')}</h2>
          <p className="page-header__subtitle">
            {t('dentalChart.subtitle')} — {ageCategory === 'child' ? `Primaire (20 ${t('dentalChart.teeth')})` : `${t('dentalChart.permanent')} (32 ${t('dentalChart.teeth')})`}
            {ageCategory === 'senior' && ' · Senior'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select className="form-select" value={selectedPatientId} onChange={handlePatientChange} style={{ width: '220px' }}>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
          </select>
          <Button variant="secondary" size="sm" onClick={loadChart}><RefreshCw size={14} /> {t('common.refresh')}</Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {chartLoading ? <Spinner /> : chart ? (
        <OdontogramGrid teeth={chart.teeth} ageCategory={ageCategory} onToothClick={handleToothClick} />
      ) : (
        <div className="empty-state" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <p className="empty-state__title">{t('common.noData')}</p>
          <p className="empty-state__text">{t('dentalChart.selectPatient')}</p>
          <Button variant="secondary" size="sm" onClick={loadChart} style={{ marginTop: '12px' }}><RefreshCw size={14} /> {t('common.refresh')}</Button>
        </div>
      )}

      {selectedTooth && (
        <ToothModal tooth={selectedTooth} ageCategory={ageCategory} canEditStatus={canEditStatus} canEditNotes={canEditNotes} onSave={handleToothUpdate} onClose={() => setSelectedTooth(null)} />
      )}
    </div>
  );
}
