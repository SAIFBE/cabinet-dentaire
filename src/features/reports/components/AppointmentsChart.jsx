import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AppointmentsChart({ data }) {
  const { t } = useTranslation();

  return (
    <div className="card">
      <div className="card__header">
        <h3 className="card__title">{t('reports.weeklyAppointments')}</h3>
      </div>
      <div className="card__body">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name={t('reports.totalAppointments')} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
