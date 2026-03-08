import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const COLORS = ['#0f766e', '#2563eb', '#d97706', '#e11d48', '#8b5cf6', '#06b6d4', '#84cc16'];

export function PatientsStats({ treatmentTypes, lowStockItems }) {
  const { t } = useTranslation();

  const pieData = treatmentTypes?.map((tt) => ({
    name: tt.name ? t(`appointmentTypes.${tt.name}`, tt.name) : t('appointmentTypes.Other'),
    value: tt.count
  })) || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div className="card">
        <div className="card__header"><h3 className="card__title">{t('reports.treatmentDistribution')}</h3></div>
        <div className="card__body">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card__header"><h3 className="card__title">{t('reports.stockAlerts')}</h3></div>
        <div className="card__body">
          {lowStockItems?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lowStockItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--color-danger-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-danger)', borderLeftWidth: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} style={{ color: 'var(--color-danger)' }} />
                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{item.quantity} {t('reports.remaining')}</span>
                    <span className="badge badge--danger">{t('reports.low')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '32px' }}>
              <p className="empty-state__text">{t('reports.allStockHealthy')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
