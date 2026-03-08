import { useLoginForm } from '../hooks/useLoginForm';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';
import { Lock, User } from 'lucide-react';

export function LoginForm() {
  const { t } = useTranslation();
  const { form, error, isSubmitting, handleSubmit } = useLoginForm();
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <Alert type="error" message={t('auth.invalidCredentials')} />}

      <Input
        label={t('auth.username')}
        id="login-username"
        placeholder={t('auth.usernamePlaceholder')}
        autoComplete="username"
        error={errors.username?.message}
        {...register('username')}
      />

      <Input
        label={t('auth.password')}
        id="login-password"
        type="password"
        placeholder={t('auth.passwordPlaceholder')}
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <div style={{ marginTop: '24px' }}>
        <Button
          type="submit"
          full
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
        </Button>
      </div>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.78rem', color: 'var(--color-text-light)' }}>
        {t('auth.demoHint')}
      </p>
    </form>
  );
}
