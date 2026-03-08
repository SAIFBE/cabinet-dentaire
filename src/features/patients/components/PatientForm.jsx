import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { patientSchema } from '../validation/patientSchema';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';

const INSURANCE_OPTIONS = ['CNSS', 'CNOPS'];

export function PatientForm({ defaultValues, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: defaultValues || {
      firstName: '', lastName: '', email: '', phone: '',
      dateOfBirth: '', address: '', notes: '', insurance: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-row">
        <Input label={t('patients.firstName')} placeholder="Jean" error={errors.firstName?.message} {...register('firstName')} />
        <Input label={t('patients.lastName')} placeholder="Dupont" error={errors.lastName?.message} {...register('lastName')} />
      </div>
      <div className="form-row">
        <Input label={t('common.email')} type="email" placeholder="jean@exemple.com" error={errors.email?.message} {...register('email')} />
        <Input label={t('common.phone')} placeholder="06 12 34 56 78" error={errors.phone?.message} {...register('phone')} />
      </div>
      <div className="form-row">
        <Input label={t('patients.dateOfBirth')} type="date" error={errors.dateOfBirth?.message} {...register('dateOfBirth')} />
        <Input label={t('common.address')} placeholder="123 Rue Principale" error={errors.address?.message} {...register('address')} />
      </div>

      {/* Insurance Selection */}
      <div className="form-group">
        <label className="form-label">Assurance</label>
        <div className="care-sheet-form__radio-group">
          {INSURANCE_OPTIONS.map((opt) => (
            <label key={opt} className="care-sheet-form__radio-label">
              <input type="radio" value={opt} {...register('insurance')} />
              <span className="care-sheet-form__radio-text">{opt}</span>
            </label>
          ))}
        </div>
        {errors.insurance?.message && (
          <span className="form-error">{errors.insurance.message}</span>
        )}
      </div>

      <Input label={t('common.notes')} type="textarea" placeholder={t('patients.additionalNotes')} error={errors.notes?.message} {...register('notes')} />
      <div className="modal__footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {defaultValues ? t('patients.updatePatient') : t('patients.addPatient')}
        </Button>
      </div>
    </form>
  );
}

