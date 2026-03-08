import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatMAD } from '../../../utils/currency';

export function RevenueChart({ data }) {
  const { t } = useTranslation();

  return (
    <div className="card">
      <div className="card__header">
        <h3 className="card__title">{t('reports.monthlyRevenue')}</h3>
      </div>
      <div className="card__body">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatMAD(v)} />
            <Tooltip formatter={(value) => [formatMAD(value), t('reports.revenue')]} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <Bar dataKey="revenue" fill="#0f766e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
