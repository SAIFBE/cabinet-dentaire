import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { toothUpdateSchema, TOOTH_STATUSES } from '../validation/dentalChartSchema';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';
import { X } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

const STATUS_LABEL_KEYS = {
  healthy: 'dentalChart.healthy',
  caries: 'dentalChart.caries',
  filled: 'dentalChart.filled',
  missing: 'dentalChart.missing',
  crown: 'dentalChart.crown',
  implant: 'dentalChart.implant',
  'root-canal': 'dentalChart.rootCanal',
};

export function ToothModal({ tooth, ageCategory, canEditStatus, canEditNotes, onSave, onClose }) {
  const { t } = useTranslation();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(toothUpdateSchema),
    defaultValues: { toothNumber: tooth.toothNumber, status: tooth.status || 'healthy', notes: tooth.notes || '' },
  });

  const onFormSubmit = async (data) => {
    setError('');
    try {
      const patch = {};
      if (canEditStatus) patch.status = data.status;
      if (canEditNotes) patch.notes = data.notes;
      await onSave(tooth.toothNumber, patch);
    } catch { setError(t('dentalChart.updateError')); }
  };

  const canEdit = canEditStatus || canEditNotes;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{t('dentalChart.toothDetails')} #{tooth.toothNumber}</h3>
          <button className="modal__close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal__body">
          {error && <Alert type="error" message={error} />}
          <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div><strong>{t('dentalChart.toothNumber')} :</strong> {tooth.toothNumber}</div>
              <div><strong>{t('dentalChart.ageCategory')} :</strong> {ageCategory}</div>
              {tooth.updatedAt && <div><strong>{t('common.date')} :</strong> {formatDate(tooth.updatedAt)}</div>}
              {tooth.updatedBy && <div><strong>{t('common.by')} :</strong> {tooth.updatedBy}</div>}
            </div>
          </div>

          {canEdit ? (
            <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
              <input type="hidden" {...register('toothNumber')} />
              <div className="form-group">
                <label className="form-label">{t('dentalChart.statusLabel')}</label>
                <select className={`form-select ${errors.status ? 'form-input--error' : ''}`} disabled={!canEditStatus} {...register('status')}>
                  {TOOTH_STATUSES.map((s) => <option key={s} value={s}>{t(STATUS_LABEL_KEYS[s] || s)}</option>)}
                </select>
                {errors.status && <p className="form-error">{errors.status.message}</p>}
                {!canEditStatus && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '4px' }}>{t('dentalChart.readOnly')}</p>}
              </div>
              <Input label={t('dentalChart.medicalNotes')} type="textarea" placeholder={t('patients.additionalNotes')} error={errors.notes?.message} {...register('notes')} />
              <div className="modal__footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
                <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>{t('dentalChart.saveChanges')}</Button>
              </div>
            </form>
          ) : (
            <div>
              <div className="form-group">
                <label className="form-label">{t('dentalChart.statusLabel')}</label>
                <p style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>{t(STATUS_LABEL_KEYS[tooth.status] || tooth.status)}</p>
              </div>
              <div className="form-group">
                <label className="form-label">{t('dentalChart.medicalNotes')}</label>
                <p style={{ fontSize: '0.9rem', color: tooth.notes ? 'var(--color-text)' : 'var(--color-text-light)' }}>
                  {tooth.notes || t('common.noData')}
                </p>
              </div>
              <div className="modal__footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
                <Button variant="secondary" onClick={onClose}>{t('common.close')}</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
