import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';
import { Shield, Save } from 'lucide-react';

const MOCK_USERS = [
  { id: '1', name: 'Dr. Sarah Mitchell', username: 'admin', role: 'admin' },
  { id: '2', name: 'Emily Johnson', username: 'secretary', role: 'secretary' },
  { id: '3', name: 'James Wilson', username: 'assistant', role: 'assistant' },
];

const AVAILABLE_ROLES = ['admin', 'secretary', 'assistant'];

const ROLE_LABELS = { admin: 'settings.admin', secretary: 'settings.secretary', assistant: 'settings.assistant' };

export function RoleManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState(MOCK_USERS);
  const [success, setSuccess] = useState('');

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  const handleSave = () => {
    setSuccess(t('common.save') + ' ✓');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div>
      {success && <Alert type="success" message={success} />}
      <table className="data-table">
        <thead>
          <tr>
            <th>{t('common.name')}</th>
            <th>{t('auth.username')}</th>
            <th>{t('settings.role')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ fontWeight: 500 }}>{u.name}</td>
              <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{u.username}</td>
              <td>
                <select className="form-select" value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} style={{ width: '160px', padding: '6px 10px' }}>
                  {AVAILABLE_ROLES.map((r) => <option key={r} value={r}>{t(ROLE_LABELS[r], r)}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '16px', textAlign: 'right' }}>
        <Button onClick={handleSave}><Save size={16} /> {t('common.save')}</Button>
      </div>
    </div>
  );
}
