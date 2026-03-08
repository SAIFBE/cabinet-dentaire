import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';
import { X, Plus, Trash2 } from 'lucide-react';

export function PrescriptionForm({ patients, onSave, onClose }) {
  const { t } = useTranslation();
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctorName, setDoctorName] = useState('Dr. Sarah Mitchell');
  const [medications, setMedications] = useState([{ name: '', dosage: '', duration: '', instructions: '' }]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedPatient = patients.find((p) => p.id === patientId);

  const addMedication = () => setMedications([...medications, { name: '', dosage: '', duration: '', instructions: '' }]);
  const removeMedication = (index) => { if (medications.length <= 1) return; setMedications(medications.filter((_, i) => i !== index)); };
  const updateMedication = (index, field, value) => setMedications(medications.map((m, i) => i === index ? { ...m, [field]: value } : m));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!patientId) { setError(t('prescriptions.patientRequired')); return; }
    if (!doctorName.trim()) { setError(t('prescriptions.doctorRequired')); return; }
    const validMeds = medications.filter((m) => m.name && m.dosage && m.duration);
    if (validMeds.length === 0) { setError(t('prescriptions.medicationRequired')); return; }

    setLoading(true);
    try {
      await onSave({ patientId, patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : '', date: new Date().toISOString().split('T')[0], doctorName, medications: validMeds, notes });
      onClose();
    } catch { setError(t('prescriptions.saveError')); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{t('prescriptions.newPrescription')}</h3>
          <button className="modal__close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal__body">
          {error && <Alert type="error" message={error} />}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('common.patient')}</label>
                <select className="form-select" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('common.doctor')}</label>
                <input className="form-input" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label className="form-label" style={{ margin: 0 }}>{t('prescriptions.medications')}</label>
                <Button type="button" variant="ghost" size="sm" onClick={addMedication}><Plus size={14} /> {t('prescriptions.addMedication')}</Button>
              </div>
              {medications.map((med, i) => (
                <div key={i} style={{ padding: '12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', marginBottom: '8px', border: '1px solid var(--color-border)' }}>
                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: '8px' }}>
                      <input className="form-input" placeholder={t('prescriptions.medicationName') + ' *'} value={med.name} onChange={(e) => updateMedication(i, 'name', e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '8px' }}>
                      <input className="form-input" placeholder={t('prescriptions.dosage') + ' *'} value={med.dosage} onChange={(e) => updateMedication(i, 'dosage', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <input className="form-input" placeholder={t('prescriptions.duration') + ' *'} value={med.duration} onChange={(e) => updateMedication(i, 'duration', e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <input className="form-input" placeholder={t('prescriptions.instructions')} value={med.instructions} onChange={(e) => updateMedication(i, 'instructions', e.target.value)} />
                      </div>
                      {medications.length > 1 && (
                        <button type="button" className="btn btn--ghost btn--sm" onClick={() => removeMedication(i)} style={{ marginTop: '2px' }}><Trash2 size={14} /></button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">{t('common.notes')}</label>
              <textarea className="form-input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('patients.additionalNotes')} />
            </div>
            <div className="modal__footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
              <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
              <Button type="submit" loading={loading}>{t('prescriptions.savePrescription')}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
