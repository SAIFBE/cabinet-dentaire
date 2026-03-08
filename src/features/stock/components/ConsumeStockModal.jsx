import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { stockApi } from '../../../services/api/stockApi';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';
import { X } from 'lucide-react';

const REASONS = [
  'usedDuringTreatment',
  'damaged',
  'expired',
  'other',
];

export function ConsumeStockModal({ item, onClose, onSuccess }) {
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
      await stockApi.consumeProduct(item.id, {
        quantity: qty,
        reason: reason || REASONS[0],
      });
      onSuccess();
      onClose();
    } catch (err) {
      if (err.code === 'INSUFFICIENT_STOCK') {
        setError(t('stock.movements.insufficientStock'));
      } else {
        setError(t('stock.movements.consumeError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal__header">
          <h3 className="modal__title">{t('stock.movements.consumeTitle')}</h3>
          <button className="modal__close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal__body">
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            <strong>{item.name}</strong> — {t('stock.movements.available')}: <strong>{item.quantity}</strong> {item.unit}
          </p>

          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label={t('stock.quantity')}
              type="number"
              min="1"
              max={item.quantity}
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <div style={{ marginBottom: '18px' }}>
              <label className="form-label">{t('stock.movements.reason')}</label>
              <select
                className="form-select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>{t(`stock.movements.reasons.${r}`)}</option>
                ))}
              </select>
            </div>
            <div className="modal__footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
              <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
              <Button type="submit" loading={submitting} disabled={submitting}>{t('stock.movements.consume')}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
