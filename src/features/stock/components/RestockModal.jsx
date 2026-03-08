import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { stockApi } from '../../../services/api/stockApi';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';
import { X } from 'lucide-react';

export function RestockModal({ item, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      setError(t('stock.movements.invalidQuantity'));
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await stockApi.restockProduct(item.id, {
        quantity: qty,
        reason: reason || t('stock.movements.restockDefault'),
      });
      onSuccess();
      onClose();
    } catch {
      setError(t('stock.movements.restockError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal__header">
          <h3 className="modal__title">{t('stock.movements.restockTitle')}</h3>
          <button className="modal__close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal__body">
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            <strong>{item.name}</strong> — {t('stock.movements.currentQty')}: <strong>{item.quantity}</strong> {item.unit}
          </p>

          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label={t('stock.movements.addQuantity')}
              type="number"
              min="1"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <Input
              label={t('stock.movements.reason')}
              placeholder={t('stock.movements.restockDefault')}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="modal__footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
              <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
              <Button type="submit" loading={submitting} disabled={submitting}>{t('stock.movements.restock')}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
