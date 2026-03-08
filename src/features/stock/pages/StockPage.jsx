import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { stockApi } from '../../../services/api/stockApi';
import { StockItemForm } from '../components/StockItemForm';
import { ConsumeStockModal } from '../components/ConsumeStockModal';
import { RestockModal } from '../components/RestockModal';
import { MovementHistoryModal } from '../components/MovementHistoryModal';
import { Button } from '../../../shared/components/Button';
import { Spinner } from '../../../shared/components/Spinner';
import { Alert } from '../../../shared/components/Alert';
import { Card } from '../../../shared/components/Card';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { STATUS_CONFIG, STOCK_STATUSES } from '../../../utils/stockStatus';
import { Plus, X, Package, Minus, RotateCcw, Clock } from 'lucide-react';

export function StockPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Movement modals
  const [consumeItem, setConsumeItem] = useState(null);
  const [restockItem, setRestockItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);

  const loadItems = useCallback(async () => {
    try {
      setError('');
      const data = await stockApi.getAll();
      setItems(data);
    } catch { setError(t('stock.loadError')); }
    finally { setLoading(false); }
  }, [t]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const handleCreate = async (data) => {
    try {
      await stockApi.create(data);
      setShowModal(false);
      loadItems();
    } catch { setError(t('stock.addError')); }
  };

  const handleConsumeSuccess = () => {
    setSuccess(t('stock.movements.consumeSuccess'));
    loadItems();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleRestockSuccess = () => {
    setSuccess(t('stock.movements.restockSuccess'));
    loadItems();
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading) return <Spinner />;

  const filtered = statusFilter === 'all'
    ? items
    : items.filter((i) => i.computedStatus === statusFilter);

  const lowCount = items.filter((i) => i.computedStatus === 'low_stock').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">{t('stock.title')}</h2>
          <p className="page-header__subtitle">{t('stock.itemsCount', { count: items.length })} · {lowCount} {t('stock.lowStock')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '180px' }}
          >
            <option value="all">{t('stock.allStatuses')}</option>
            {STOCK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].icon} {t(`stockStatuses.${s}`)}
              </option>
            ))}
          </select>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> {t('stock.addItem')}
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <Card>
        {filtered.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('stock.itemName')}</th>
                <th>{t('common.category')}</th>
                <th>{t('stock.quantity')}</th>
                <th>{t('stock.unitPrice')}</th>
                <th>{t('stock.supplier')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const status = item.computedStatus || 'in_stock';
                const config = STATUS_CONFIG[status] || STATUS_CONFIG.in_stock;
                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td><span className="badge badge--neutral">{t(`stockCategories.${item.category}`, item.category)}</span></td>
                    <td>
                      <span style={{ fontWeight: 600, color: status === 'out_of_stock' || status === 'low_stock' ? 'var(--color-danger)' : 'inherit' }}>{item.quantity}</span>
                      <span style={{ color: 'var(--color-text-light)', fontSize: '0.75rem' }}> / {t('common.min')} {item.minQuantity} {item.unit}</span>
                    </td>
                    <td>{formatCurrency(item.unitPrice)}</td>
                    <td>{item.supplier}</td>
                    <td>
                      <span className={`badge ${config.badge}`}>
                        {config.icon} {t(`stockStatuses.${status}`)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn--ghost btn--icon"
                          title={t('stock.movements.consume')}
                          onClick={() => setConsumeItem(item)}
                          disabled={item.quantity === 0}
                        >
                          <Minus size={15} />
                        </button>
                        <button
                          className="btn btn--ghost btn--icon"
                          title={t('stock.movements.restock')}
                          onClick={() => setRestockItem(item)}
                        >
                          <RotateCcw size={15} />
                        </button>
                        <button
                          className="btn btn--ghost btn--icon"
                          title={t('stock.movements.history')}
                          onClick={() => setHistoryItem(item)}
                        >
                          <Clock size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <Package size={40} className="empty-state__icon" />
            <p className="empty-state__title">{t('stock.noItems')}</p>
            <p className="empty-state__text">{t('stock.noItemsSub')}</p>
          </div>
        )}
      </Card>

      {/* Add Item Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">{t('stock.addStockItem')}</h3>
              <button className="modal__close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal__body">
              <StockItemForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Consume Modal */}
      {consumeItem && (
        <ConsumeStockModal
          item={consumeItem}
          onClose={() => setConsumeItem(null)}
          onSuccess={handleConsumeSuccess}
        />
      )}

      {/* Restock Modal */}
      {restockItem && (
        <RestockModal
          item={restockItem}
          onClose={() => setRestockItem(null)}
          onSuccess={handleRestockSuccess}
        />
      )}

      {/* Movement History Modal */}
      {historyItem && (
        <MovementHistoryModal
          item={historyItem}
          onClose={() => setHistoryItem(null)}
        />
      )}
    </div>
  );
}
