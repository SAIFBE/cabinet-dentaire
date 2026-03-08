import { useTranslation } from 'react-i18next';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { formatDate, formatCurrency } from '../../../lib/utils';
import { Printer, Plus, XCircle, CreditCard } from 'lucide-react';

const statusColors = {
  draft: 'secondary',
  issued: 'warning',
  partial: 'info',
  paid: 'success',
  cancelled: 'danger',
  refunded: 'secondary',
};

export function InvoiceDetails({ invoice, onAddPayment, onCancel, onPrint }) {
  const { t } = useTranslation();
  if (!invoice) return null;

  const canAddPayment = invoice.status !== 'cancelled' && invoice.status !== 'paid' && invoice.status !== 'refunded';
  const canCancel = invoice.status !== 'cancelled' && invoice.status !== 'paid';

  return (
    <div>
      {/* Header info */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{invoice.number}</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-light)', fontSize: '0.85rem' }}>
              {t('billing.invoiceDate')}: {formatDate(invoice.issuedAt)}
            </p>
            <span className={`badge badge--${statusColors[invoice.status] || 'secondary'}`} style={{ marginTop: '8px', display: 'inline-block' }}>
              {t(`statuses.${invoice.status}`)}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{t('billing.patientInfo')}</h3>
            <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{invoice.patientName}</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', margin: '16px 0', flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={onPrint}>
          <Printer size={16} /> {t('billing.printInvoice')}
        </Button>
        {canAddPayment && (
          <Button onClick={onAddPayment}>
            <Plus size={16} /> {t('billing.addPayment')}
          </Button>
        )}
        {canCancel && (
          <Button variant="ghost" onClick={onCancel} style={{ color: 'var(--color-danger)' }}>
            <XCircle size={16} /> {t('billing.cancelInvoice')}
          </Button>
        )}
      </div>

      {/* Items table */}
      <Card title={t('billing.invoiceItems')}>
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('common.description')}</th>
              <th style={{ textAlign: 'center' }}>{t('billing.qty')}</th>
              <th style={{ textAlign: 'right' }}>{t('billing.unitPrice')}</th>
              <th style={{ textAlign: 'right' }}>{t('billing.lineTotal')}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.description}</td>
                <td style={{ textAlign: 'center' }}>{item.qty}</td>
                <td style={{ textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ maxWidth: '300px', marginLeft: 'auto', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem' }}>
            <span>{t('billing.subtotal')}</span>
            <span style={{ fontFamily: 'monospace' }}>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.taxAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem' }}>
              <span>{t('billing.taxAmount')} ({invoice.taxRate}%)</span>
              <span style={{ fontFamily: 'monospace' }}>{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}
          {invoice.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', color: 'var(--color-success)' }}>
              <span>{t('billing.discount')}</span>
              <span style={{ fontFamily: 'monospace' }}>-{formatCurrency(invoice.discount)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '1.1rem', fontWeight: 700, borderTop: '2px solid var(--color-border)', marginTop: '4px' }}>
            <span>{t('common.total')}</span>
            <span style={{ fontFamily: 'monospace' }}>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </Card>

      {/* Payment History */}
      <Card title={t('billing.paymentHistory')} style={{ marginTop: '16px' }}>
        {invoice.payments && invoice.payments.length > 0 ? (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('common.date')}</th>
                  <th>{t('billing.method')}</th>
                  <th style={{ textAlign: 'right' }}>{t('billing.amount')}</th>
                  <th>{t('billing.reference')}</th>
                  <th>{t('billing.paymentNote')}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.payments.map((pay, idx) => (
                  <tr key={idx}>
                    <td>{formatDate(pay.paidAt)}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CreditCard size={14} /> {t(`paymentMethods.${pay.method}`)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--color-success)' }}>{formatCurrency(pay.amount)}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{pay.reference || '—'}</td>
                    <td style={{ color: 'var(--color-text-light)', fontSize: '0.85rem' }}>{pay.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontWeight: 600, fontSize: '1rem' }}>
              <span>{t('billing.paidAmount')}</span>
              <span style={{ color: 'var(--color-success)', fontFamily: 'monospace' }}>{formatCurrency(invoice.paidAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0 0', fontWeight: 700, fontSize: '1.05rem' }}>
              <span>{t('billing.balance')}</span>
              <span style={{ color: invoice.balance > 0 ? 'var(--color-danger)' : 'var(--color-success)', fontFamily: 'monospace' }}>{formatCurrency(invoice.balance)}</span>
            </div>
          </>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '24px 0' }}>{t('billing.noPayments')}</p>
        )}
      </Card>

      {/* Notes */}
      {invoice.notes && (
        <Card title={t('common.notes')} style={{ marginTop: '16px' }}>
          <p style={{ margin: 0 }}>{invoice.notes}</p>
        </Card>
      )}
    </div>
  );
}
