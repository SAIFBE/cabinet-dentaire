import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { stockSchema } from '../validation/stockSchema';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';

const categories = ['Consumables', 'Materials', 'Medication', 'Equipment', 'Instruments', 'Other'];

export function StockItemForm({ onSubmit, onCancel }) {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(stockSchema),
    defaultValues: { name: '', category: '', quantity: '', minQuantity: '', unit: '', unitPrice: '', supplier: '', expiryDate: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input label={t('stock.itemName')} placeholder="Gants latex (Boîte)" error={errors.name?.message} {...register('name')} />
      <div className="form-row">
        <Input label={t('common.category')} type="select" error={errors.category?.message} {...register('category')}>
          <option value="">{t('stock.selectCategory')}</option>
          {categories.map((c) => <option key={c} value={c}>{t(`stockCategories.${c}`, c)}</option>)}
        </Input>
        <Input label={t('stock.supplier')} placeholder="MedSupply Co." error={errors.supplier?.message} {...register('supplier')} />
      </div>
      <div className="form-row">
        <Input label={t('stock.quantity')} type="number" placeholder="0" error={errors.quantity?.message} {...register('quantity')} />
        <Input label={t('stock.minQuantity')} type="number" placeholder="10" error={errors.minQuantity?.message} {...register('minQuantity')} />
      </div>
      <div className="form-row">
        <Input label={t('stock.unit')} placeholder="boîtes" error={errors.unit?.message} {...register('unit')} />
        <Input label={t('stock.unitPrice')} type="number" placeholder="0.00" step="0.01" error={errors.unitPrice?.message} {...register('unitPrice')} />
      </div>
      <div className="form-row">
        <Input label={t('stock.expiryDate')} type="date" error={errors.expiryDate?.message} {...register('expiryDate')} />
      </div>
      <div className="modal__footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>{t('stock.addStockItem')}</Button>
      </div>
    </form>
  );
}
