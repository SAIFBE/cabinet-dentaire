import { useTranslation } from 'react-i18next';
import { formatDate, formatCurrency } from '../../../lib/utils';

export function InvoicePrintView({ invoice }) {
  const { t } = useTranslation();
  if (!invoice) return null;

  return (
    <div className="print-only" id="invoice-print-area">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-print-area, #invoice-print-area * { visibility: visible; }
          #invoice-print-area {
            position: absolute; left: 0; top: 0; width: 210mm; padding: 20mm;
            font-family: 'Segoe UI', system-ui, sans-serif; font-size: 11pt; color: #1a1a2e;
          }
          .no-print { display: none !important; }
        }
        @media screen {
          #invoice-print-area { display: none; }
        }
      `}</style>

      {/* Clinic Header */}
      <div style={{ borderBottom: '3px solid #1a1a2e', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '22pt', color: '#1a1a2e' }}>{t('billing.clinicName')}</h1>
        <p style={{ margin: '4px 0 0', fontSize: '10pt', color: '#555' }}>{t('billing.clinicAddress')}</p>
        <p style={{ margin: '2px 0 0', fontSize: '10pt', color: '#555' }}>{t('billing.clinicPhone')}</p>
      </div>

      {/* Invoice meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '16pt' }}>{t('billing.invoice')} {invoice.number}</h2>
          <p style={{ margin: '4px 0', fontSize: '10pt', color: '#666' }}>
            {t('billing.invoiceDate')}: {formatDate(invoice.issuedAt)}
          </p>
          <p style={{ margin: '2px 0', fontSize: '10pt' }}>
            {t('common.status')}: {t(`statuses.${invoice.status}`)}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h3 style={{ margin: '0 0 6px', fontSize: '11pt', color: '#666' }}>{t('billing.patientInfo')}</h3>
          <p style={{ margin: 0, fontWeight: 600 }}>{invoice.patientName}</p>
        </div>
      </div>

      {/* Items table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #1a1a2e' }}>
            <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: '9pt' }}>{t('common.description')}</th>
            <th style={{ textAlign: 'center', padding: '8px 4px', fontSize: '9pt' }}>{t('billing.qty')}</th>
            <th style={{ textAlign: 'right', padding: '8px 4px', fontSize: '9pt' }}>{t('billing.unitPrice')}</th>
            <th style={{ textAlign: 'right', padding: '8px 4px', fontSize: '9pt' }}>{t('billing.lineTotal')}</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
              <td style={{ padding: '8px 4px' }}>{item.description}</td>
              <td style={{ padding: '8px 4px', textAlign: 'center' }}>{item.qty}</td>
              <td style={{ padding: '8px 4px', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
              <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ marginLeft: 'auto', width: '250px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '10pt' }}>
          <span>{t('billing.subtotal')}</span>
          <span>{formatCurrency(invoice.subtotal)}</span>
        </div>
        {invoice.taxAmount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '10pt' }}>
            <span>{t('billing.taxAmount')} ({invoice.taxRate}%)</span>
            <span>{formatCurrency(invoice.taxAmount)}</span>
          </div>
        )}
        {invoice.discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '10pt', color: '#16a34a' }}>
            <span>{t('billing.discount')}</span>
            <span>-{formatCurrency(invoice.discount)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13pt', fontWeight: 700, borderTop: '2px solid #1a1a2e', marginTop: '4px' }}>
          <span>{t('common.total')}</span>
          <span>{formatCurrency(invoice.total)}</span>
        </div>
      </div>

      {/* Payments summary */}
      {invoice.payments && invoice.payments.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '12pt', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>
            {t('billing.paymentHistory')}
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: '9pt', borderBottom: '1px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '4px' }}>{t('common.date')}</th>
                <th style={{ textAlign: 'left', padding: '4px' }}>{t('billing.method')}</th>
                <th style={{ textAlign: 'right', padding: '4px' }}>{t('billing.amount')}</th>
                <th style={{ textAlign: 'left', padding: '4px' }}>{t('billing.reference')}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.payments.map((pay, idx) => (
                <tr key={idx} style={{ fontSize: '10pt', borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '4px' }}>{formatDate(pay.paidAt)}</td>
                  <td style={{ padding: '4px' }}>{t(`paymentMethods.${pay.method}`)}</td>
                  <td style={{ padding: '4px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(pay.amount)}</td>
                  <td style={{ padding: '4px' }}>{pay.reference || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontWeight: 600 }}>
            <span>{t('billing.balance')}</span>
            <span>{formatCurrency(invoice.balance)}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '9pt', color: '#999', borderTop: '1px solid #ddd', paddingTop: '12px' }}>
        {t('billing.clinicName')} · {t('billing.clinicAddress')} · {t('billing.clinicPhone')}
      </div>
    </div>
  );
}
