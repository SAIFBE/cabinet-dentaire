import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const icons = {
  error: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

export function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;
  const Icon = icons[type] || AlertCircle;

  return (
    <div className={`alert alert--${type}`} role="alert">
      <Icon size={18} />
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
          ×
        </button>
      )}
    </div>
  );
}
