import { useTranslation } from 'react-i18next';
import { X, Printer } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export function PrescriptionPDFPreview({ prescription, onClose }) {
  const { t } = useTranslation();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{t('prescriptions.preview')}</h3>
          <button className="modal__close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal__body">
          <div className="prescription-preview" id="prescription-print">
            <div className="prescription-preview__header">
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary)' }}>Dentisafe</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{t('common.appSubtitle')}</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                <div><strong>{prescription.doctorName}</strong></div>
                <div>{t('common.date')} : {prescription.date}</div>
                <div>Rx #{prescription.id}</div>
              </div>
            </div>
            <div style={{ borderTop: '2px solid var(--color-primary)', margin: '16px 0' }} />
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{t('common.patient')}</div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>{prescription.patientName}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-secondary)' }}>{t('prescriptions.medications')}</div>
              {prescription.medications.map((med, i) => (
                <div key={i} style={{ padding: '10px 12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', marginBottom: '6px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{med.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{med.dosage} · {med.duration}</div>
                  {med.instructions && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', fontStyle: 'italic', marginTop: '2px' }}>{med.instructions}</div>}
                </div>
              ))}
            </div>
            {prescription.notes && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{t('common.notes')}</div>
                <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>{prescription.notes}</p>
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
              <span>{t('prescriptions.signature')} : ________________________</span>
              <span>{t('prescriptions.stamp')}</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <Button variant="secondary" onClick={onClose}>{t('common.close')}</Button>
            <Button onClick={() => window.print()}><Printer size={16} /> {t('common.print')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
