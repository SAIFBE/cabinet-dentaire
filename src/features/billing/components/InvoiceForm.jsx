import { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { billingSchema } from '../validation/billingSchema';
import { patientsApi } from '../../../services/api/patientsApi';
import { appointmentsApi } from '../../../services/api/appointmentsApi';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { formatCurrency } from '../../../lib/utils';
import { Plus, Trash2 } from 'lucide-react';

export function InvoiceForm({ onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      patientId: '',
      appointmentId: '',
      items: [{ description: '', qty: 1, unitPrice: '' }],
      taxRate: 0,
      discount: 0,
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const watchedItems = watch('items');
  const watchedPatientId = watch('patientId');
  const watchedTaxRate = watch('taxRate');
  const watchedDiscount = watch('discount');

  // Load patients on mount
  useEffect(() => {
    patientsApi.getAll().then(setPatients).catch(() => {});
  }, []);

  // Load appointments when patient changes
  useEffect(() => {
    if (watchedPatientId) {
      appointmentsApi.getByPatient(watchedPatientId).then(setAppointments).catch(() => setAppointments([]));
    } else {
      setAppointments([]);
    }
  }, [watchedPatientId]);

  // Live calculations
  const calculations = useMemo(() => {
    const subtotal = (watchedItems || []).reduce((sum, item) => {
      return sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
    }, 0);
    const taxRate = Number(watchedTaxRate) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const discount = Number(watchedDiscount) || 0;
    const total = subtotal + taxAmount - discount;
    return { subtotal, taxAmount, total: Math.max(0, total) };
  }, [watchedItems, watchedTaxRate, watchedDiscount]);

  const onFormSubmit = (data) => {
    const patient = patients.find((p) => p.id === data.patientId);
    onSubmit({
      ...data,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
      {/* Patient selection */}
      <Input label={t('billing.selectPatient')} type="select" error={errors.patientId?.message} {...register('patientId')}>
        <option value="">{t('billing.selectPatient')}...</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
        ))}
      </Input>

      {/* Appointment linking */}
      {appointments.length > 0 && (
        <Input label={t('billing.selectAppointment')} type="select" {...register('appointmentId')}>
          <option value="">{t('billing.noAppointment')}</option>
          {appointments.map((a) => (
            <option key={a.id} value={a.id}>{a.date} — {a.type}</option>
          ))}
        </Input>
      )}

      {/* Invoice items */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label className="form-label" style={{ margin: 0 }}>{t('billing.invoiceItems')}</label>
          <Button type="button" variant="ghost" size="sm" onClick={() => append({ description: '', qty: 1, unitPrice: '' })}>
            <Plus size={14} /> {t('billing.addItem')}
          </Button>
        </div>

        {errors.items?.message && (
          <p className="form-error" style={{ marginBottom: '8px' }}>{errors.items.message}</p>
        )}

        {/* Item headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 110px 100px auto', gap: '8px', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--color-text-light)', fontWeight: 600 }}>
          <span>{t('common.description')}</span>
          <span>{t('billing.qty')}</span>
          <span>{t('billing.unitPrice')}</span>
          <span>{t('billing.lineTotal')}</span>
          <span></span>
        </div>

        {fields.map((field, index) => {
          const qty = Number(watchedItems?.[index]?.qty) || 0;
          const price = Number(watchedItems?.[index]?.unitPrice) || 0;
          const lineTotal = qty * price;
          return (
            <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 110px 100px auto', gap: '8px', alignItems: 'start', marginBottom: '8px' }}>
              <Input placeholder={t('billing.serviceDescription')} error={errors.items?.[index]?.description?.message} {...register(`items.${index}.description`)} />
              <Input type="number" placeholder="1" error={errors.items?.[index]?.qty?.message} {...register(`items.${index}.qty`)} />
              <Input type="number" placeholder="0.00" error={errors.items?.[index]?.unitPrice?.message} {...register(`items.${index}.unitPrice`)} />
              <div style={{ paddingTop: '8px', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'monospace' }}>{formatCurrency(lineTotal)}</div>
              <button type="button" onClick={() => fields.length > 1 && remove(index)} disabled={fields.length <= 1}
                className="btn btn--ghost btn--icon"
                style={{ marginTop: '0px', color: fields.length <= 1 ? 'var(--color-text-light)' : 'var(--color-danger)' }}>
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Tax & Discount */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
        <Input label={t('billing.tax')} type="number" placeholder="0" {...register('taxRate')} />
        <Input label={t('billing.discount')} type="number" placeholder="0.00" {...register('discount')} />
      </div>

      {/* Notes */}
      <Input label={t('common.notes')} type="textarea" placeholder="..." {...register('notes')} />

      {/* Totals summary */}
      <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg-subtle, #f8f9fa)', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
          <span>{t('billing.subtotal')}</span>
          <span style={{ fontFamily: 'monospace' }}>{formatCurrency(calculations.subtotal)}</span>
        </div>
        {calculations.taxAmount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
            <span>{t('billing.taxAmount')}</span>
            <span style={{ fontFamily: 'monospace' }}>{formatCurrency(calculations.taxAmount)}</span>
          </div>
        )}
        {(Number(watchedDiscount) || 0) > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--color-success)' }}>
            <span>{t('billing.discount')}</span>
            <span style={{ fontFamily: 'monospace' }}>-{formatCurrency(Number(watchedDiscount))}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '8px' }}>
          <span>{t('common.total')}</span>
          <span style={{ fontFamily: 'monospace' }}>{formatCurrency(calculations.total)}</span>
        </div>
      </div>

      <div className="modal__footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>{t('billing.createInvoice')}</Button>
      </div>
    </form>
  );
}
