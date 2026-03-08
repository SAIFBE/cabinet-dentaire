import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatCurrency } from '../../../lib/utils';
import { Eye, Printer } from 'lucide-react';

const statusColors = {
  draft: 'secondary',
  issued: 'warning',
  partial: 'info',
  paid: 'success',
  cancelled: 'danger',
  refunded: 'secondary',
};

export function InvoiceTable({ invoices }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>{t('billing.invoiceNumber')}</th>
          <th>{t('common.patient')}</th>
          <th>{t('common.date')}</th>
          <th>{t('billing.totalLabel')}</th>
          <th>{t('billing.paidAmount')}</th>
          <th>{t('billing.balance')}</th>
          <th>{t('common.status')}</th>
          <th>{t('common.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr key={inv.id}>
            <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>{inv.number}</td>
            <td style={{ fontWeight: 500 }}>{inv.patientName}</td>
            <td>{formatDate(inv.issuedAt || inv.createdAt)}</td>
            <td style={{ fontWeight: 600 }}>{formatCurrency(inv.total)}</td>
            <td style={{ color: 'var(--color-success)' }}>{formatCurrency(inv.paidAmount || 0)}</td>
            <td style={{ fontWeight: 600, color: (inv.balance || 0) > 0 ? 'var(--color-danger)' : 'inherit' }}>
              {formatCurrency(inv.balance ?? inv.total)}
            </td>
            <td>
              <span className={`badge badge--${statusColors[inv.status] || 'secondary'}`}>
                {t(`statuses.${inv.status}`, inv.status)}
              </span>
            </td>
            <td>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn btn--ghost btn--sm" title={t('billing.viewInvoice')} onClick={() => navigate(`/billing/${inv.id}`)}>
                  <Eye size={15} />
                </button>
                <button className="btn btn--ghost btn--sm" title={t('billing.printInvoice')} onClick={() => navigate(`/billing/${inv.id}?print=1`)}>
                  <Printer size={15} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
