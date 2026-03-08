import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { appointmentSchema } from '../validation/appointmentSchema';
import { patientsApi } from '../../../services/api/patientsApi';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';

const appointmentTypes = ['Checkup', 'Cleaning', 'Filling', 'Crown', 'Root Canal', 'Extraction', 'Orthodontics', 'Implant', 'Whitening', 'Other'];

export function AppointmentForm({ onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [patients, setPatients] = useState([]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { patientId: '', date: '', time: '', type: '', notes: '' },
  });

  useEffect(() => {
    patientsApi.getAll().then(setPatients).catch(() => {});
  }, []);

  const onFormSubmit = (data) => {
    const patient = patients.find((p) => p.id === data.patientId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : '';
    onSubmit({ ...data, patientName });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <div className="form-group">
        <label className="form-label">{t('appointments.patientName')}</label>
        <select className="form-input" {...register('patientId')}>
          <option value="">— Sélectionner un patient —</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName} — {p.phone || ''}
            </option>
          ))}
        </select>
        {errors.patientId?.message && (
          <span className="form-error">{errors.patientId.message}</span>
        )}
      </div>
      <div className="form-row">
        <Input label={t('common.date')} type="date" error={errors.date?.message} {...register('date')} />
        <Input label={t('common.time')} type="time" error={errors.time?.message} {...register('time')} />
      </div>
      <Input label={t('common.type')} type="select" error={errors.type?.message} {...register('type')}>
        <option value="">{t('appointments.selectType')}</option>
        {appointmentTypes.map((tp) => (
          <option key={tp} value={tp}>{t(`appointmentTypes.${tp}`, tp)}</option>
        ))}
      </Input>
      <Input label={t('common.notes')} type="textarea" placeholder={t('patients.additionalNotes')} error={errors.notes?.message} {...register('notes')} />
      <div className="modal__footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>{t('appointments.createAppointment')}</Button>
      </div>
    </form>
  );
}
