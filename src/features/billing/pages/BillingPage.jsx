import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { billingApi } from '../../../services/api/billingApi';
import { InvoiceForm } from '../components/InvoiceForm';
import { InvoiceTable } from '../components/InvoiceTable';
import { Button } from '../../../shared/components/Button';
import { Spinner } from '../../../shared/components/Spinner';
import { Alert } from '../../../shared/components/Alert';
import { Card } from '../../../shared/components/Card';
import { formatCurrency } from '../../../lib/utils';
import { Plus, X, Receipt } from 'lucide-react';

export function BillingPage() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [filterPatient, setFilterPatient] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const loadInvoices = useCallback(async () => {
    try {
      setError('');
      const data = await billingApi.getAll();
      setInvoices(data);
    } catch { setError(t('billing.loadError')); }
    finally { setLoading(false); }
  }, [t]);

  useEffect(() => { loadInvoices(); }, [loadInvoices]);

  const handleCreate = async (data) => {
    try {
      await billingApi.create(data);
      setShowModal(false);
      loadInvoices();
    } catch { setError(t('billing.createError')); }
  };

  // Apply filters
  const filteredInvoices = useMemo(() => {
    let result = invoices;
    if (filterPatient) {
      const q = filterPatient.toLowerCase();
      result = result.filter((inv) => inv.patientName?.toLowerCase().includes(q));
    }
    if (filterStatus) {
      result = result.filter((inv) => inv.status === filterStatus);
    }
    if (filterDate) {
      result = result.filter((inv) => (inv.issuedAt || inv.createdAt) === filterDate);
    }
    return result;
  }, [invoices, filterPatient, filterStatus, filterDate]);

  if (loading) return <Spinner />;

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const paidAmount = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const outstandingAmount = totalRevenue - paidAmount;

  const STATUSES = ['issued', 'partial', 'paid', 'cancelled', 'draft', 'refunded'];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">{t('billing.title')}</h2>
          <p className="page-header__subtitle">
            {t('billing.totalLabel')} : {formatCurrency(totalRevenue)} · {t('billing.collected')} : {formatCurrency(paidAmount)} · {t('billing.outstanding')} : {formatCurrency(outstandingAmount)}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} /> {t('billing.newInvoice')}
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Filters */}
      <Card>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            placeholder={t('billing.filterByPatient')}
            value={filterPatient}
            onChange={(e) => setFilterPatient(e.target.value)}
            style={{ maxWidth: '220px' }}
          />
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="">{t('billing.allStatuses')}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{t(`statuses.${s}`)}</option>
            ))}
          </select>
          <input
            type="date"
            className="form-input"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ maxWidth: '180px' }}
          />
          {(filterPatient || filterStatus || filterDate) && (
            <button className="btn btn--ghost btn--sm" onClick={() => { setFilterPatient(''); setFilterStatus(''); setFilterDate(''); }}>
              <X size={14} /> {t('common.refresh')}
            </button>
          )}
        </div>
      </Card>

      {/* Invoice list */}
      <Card>
        {filteredInvoices.length > 0 ? (
          <InvoiceTable invoices={filteredInvoices} />
        ) : (
          <div className="empty-state">
            <Receipt size={40} className="empty-state__icon" />
            <p className="empty-state__title">{t('billing.noInvoices')}</p>
            <p className="empty-state__text">{t('billing.noInvoicesSub')}</p>
          </div>
        )}
      </Card>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">{t('billing.newInvoice')}</h3>
              <button className="modal__close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal__body">
              <InvoiceForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
