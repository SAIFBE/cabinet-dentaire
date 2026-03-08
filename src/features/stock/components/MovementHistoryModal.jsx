import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { stockApi } from '../../../services/api/stockApi';
import { Spinner } from '../../../shared/components/Spinner';
import { Card } from '../../../shared/components/Card';
import { X } from 'lucide-react';

export function MovementHistoryModal({ item, onClose }) {
  const { t } = useTranslation();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stockApi.getMovements(item.id).then((data) => {
      setMovements(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [item.id]);

  const formatDateTime = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal__header">
          <h3 className="modal__title">{t('stock.movements.historyTitle')} — {item.name}</h3>
          <button className="modal__close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal__body" style={{ padding: '0' }}>
          {loading ? (
            <Spinner />
          ) : movements.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('common.date')}</th>
                  <th>{t('common.type')}</th>
                  <th>{t('stock.quantity')}</th>
                  <th>{t('stock.movements.reason')}</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontSize: '0.8rem' }}>{formatDateTime(m.createdAt)}</td>
                    <td>
                      <span className={`badge ${m.type === 'in' ? 'badge--success' : 'badge--danger'}`}>
                        {m.type === 'in' ? `↑ ${t('stock.movements.typeIn')}` : `↓ ${t('stock.movements.typeOut')}`}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {m.type === 'in' ? '+' : '−'}{m.quantity}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      {t(`stock.movements.reasons.${m.reason}`, m.reason)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state" style={{ padding: '32px 24px' }}>
              <p className="empty-state__title">{t('stock.movements.noMovements')}</p>
              <p className="empty-state__text">{t('stock.movements.noMovementsSub')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
