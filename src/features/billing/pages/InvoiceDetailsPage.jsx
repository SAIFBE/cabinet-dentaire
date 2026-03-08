import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { billingApi } from '../../../services/api/billingApi';
import { InvoiceDetails } from '../components/InvoiceDetails';
import { AddPaymentModal } from '../components/AddPaymentModal';
import { InvoicePrintView } from '../components/InvoicePrintView';
import { Spinner } from '../../../shared/components/Spinner';
import { Alert } from '../../../shared/components/Alert';
import { Card } from '../../../shared/components/Card';
import { ArrowLeft, FileX } from 'lucide-react';

export function InvoiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const loadInvoice = useCallback(async () => {
    try {
      setError('');
      const data = await billingApi.getById(id);
      setInvoice(data);
    } catch (err) {
      if (err.status === 404) {
        setInvoice(null);
      } else {
        setError(t('billing.loadError'));
      }
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    loadInvoice();
  }, [loadInvoice]);

  // Auto-print if ?print=1 in URL
  useEffect(() => {
    if (searchParams.get('print') === '1' && invoice) {
      setTimeout(() => window.print(), 500);
    }
  }, [searchParams, invoice]);

  const handleAddPayment = async (paymentData) => {
    await billingApi.addPayment(id, paymentData);
    setShowPaymentModal(false);
    loadInvoice();
  };

  const handleCancel = async () => {
    if (!window.confirm(t('billing.cancelConfirm'))) return;
    try {
      await billingApi.update(id, { status: 'cancelled' });
      loadInvoice();
    } catch {
      setError(t('billing.updateError'));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Spinner />;

  if (!invoice) {
    return (
      <div>
        <Link to="/billing" className="btn btn--ghost btn--sm" style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> {t('billing.backToList')}
        </Link>
        <Card>
          <div className="empty-state">
            <FileX size={40} className="empty-state__icon" />
            <p className="empty-state__title">{t('billing.notFound')}</p>
            <p className="empty-state__text">{t('billing.notFoundSub')}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Link to="/billing" className="btn btn--ghost btn--sm no-print" style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
        <ArrowLeft size={16} /> {t('billing.backToList')}
      </Link>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <InvoiceDetails
        invoice={invoice}
        onAddPayment={() => setShowPaymentModal(true)}
        onCancel={handleCancel}
        onPrint={handlePrint}
      />

      {showPaymentModal && (
        <AddPaymentModal
          invoice={invoice}
          onSubmit={handleAddPayment}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      <InvoicePrintView invoice={invoice} />
    </div>
  );
}
