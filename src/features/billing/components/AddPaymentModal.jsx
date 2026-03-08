import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { paymentSchema } from '../validation/billingSchema';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { X } from 'lucide-react';

const PAYMENT_METHODS = ['cash', 'card', 'transfer', 'cheque', 'insurance'];

export function AddPaymentModal({ invoice, onSubmit, onClose }) {
  const { t } = useTranslation();
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: invoice?.balance || '',
      method: 'cash',
      paidAt: new Date().toISOString().split('T')[0],
      reference: '',
      note: '',
    },
  });

  const onFormSubmit = async (data) => {
    try {
      setSubmitError('');
      await onSubmit(data);
    } catch {
      setSubmitError(t('billing.paymentError'));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal__header">
          <h3 className="modal__title">{t('billing.addPayment')}</h3>
          <button className="modal__close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal__body">
          {submitError && <p className="form-error" style={{ marginBottom: '12px' }}>{submitError}</p>}

          <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
            <Input
              label={t('billing.amount')}
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.amount?.message}
              {...register('amount')}
            />

            <Input label={t('billing.paymentMethod')} type="select" error={errors.method?.message} {...register('method')}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>{t(`paymentMethods.${m}`)}</option>
              ))}
            </Input>

            <Input
              label={t('billing.paymentDate')}
              type="date"
              error={errors.paidAt?.message}
              {...register('paidAt')}
            />

            <Input
              label={t('billing.paymentReference')}
              placeholder="CB-1234, VIR-5678..."
              {...register('reference')}
            />

            <Input
              label={t('billing.paymentNote')}
              type="textarea"
              placeholder="..."
              {...register('note')}
            />

            <div className="modal__footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
              <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
              <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>{t('billing.addPayment')}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
