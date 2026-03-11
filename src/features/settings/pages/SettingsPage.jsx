import { useTranslation } from 'react-i18next';
import { Card } from '../../../shared/components/Card';
import { RoleManagement } from '../components/RoleManagement';
import { Shield, FileText } from 'lucide-react';

export function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">{t('settings.title')}</h2>
          <p className="page-header__subtitle">{t('settings.subtitle')}</p>
        </div>
      </div>

      <div className="settings-section">
        <Card title={t('settings.roleManagement')} actions={<Shield size={18} style={{ color: 'var(--color-primary)' }} />}>
          <RoleManagement />
        </Card>
      </div>

      <div className="settings-section">
        <Card title={t('settings.securityAudit')} actions={<FileText size={18} style={{ color: 'var(--color-primary)' }} />}>
          <div style={{ fontSize: '0.85rem', lineHeight: '1.8' }}>
            <div className="form-row">
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--color-text)' }}>{t('settings.authentication')}</h4>
                <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '16px', listStyle: 'disc' }}>
                  <li>{t('settings.inMemoryStorage')}</li>
                  <li>{t('settings.sessionStorageFlag')}</li>
                  <li>{t('settings.localStorageNever')}</li>
                  <li>{t('settings.autoLogout')}</li>
                  <li>{t('settings.genericErrors')}</li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--color-text)' }}>{t('settings.accessControl')}</h4>
                <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '16px', listStyle: 'disc' }}>
                  <li>{t('settings.rbacRoles')}</li>
                  <li>{t('settings.protectedRoutes')}</li>
                  <li>{t('settings.roleGuard')}</li>
                  <li>{t('settings.roleSidebar')}</li>
                  <li>{t('settings.zodValidation')}</li>
                </ul>
              </div>
            </div>
            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-primary-dark)' }}>
              <strong>{t('settings.laravelReady')}</strong> {t('settings.laravelDesc')}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
