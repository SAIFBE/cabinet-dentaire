import React from 'react';
import { AlertTriangle, Info, Bell, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../security/auth/useAuth';
import { Button } from '../../../../shared/components/Button';
import { useMedicalRecords } from '../../context/MedicalRecordContext';

export function CriticalAlertBanner({ alert }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { resolveAlert } = useMedicalRecords();

  const getAlertConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          icon: <AlertTriangle size={24} color="white" />,
          bgColor: 'var(--color-danger)',
          textColor: 'white',
          borderColor: '#b91c1c', // darker red for border
          headerColor: 'rgba(255,255,255,0.9)'
        };
      case 'warning':
        return {
          icon: <Bell size={24} color="white" />,
          bgColor: '#f97316',
          textColor: 'white',
          borderColor: '#ea580c',
          headerColor: 'rgba(255,255,255,0.9)'
        };
      default:
        return {
          icon: <Info size={24} color="var(--color-info)" />,
          bgColor: 'var(--color-info-bg)',
          textColor: 'var(--color-info)',
          borderColor: '#bfdbfe',
          headerColor: 'rgba(107, 114, 128, 0.9)'
        };
    }
  };

  const config = getAlertConfig(alert.severity);
  const canResolve = user?.role === 'admin';

  return (
    <div
      style={{
         borderRadius: '8px',
         padding: '16px',
         marginBottom: '16px',
         display: 'flex',
         alignItems: 'flex-start',
         gap: '16px',
         boxShadow: 'var(--shadow-sm)',
         border: `1px solid ${config.borderColor}`,
         backgroundColor: config.bgColor,
         color: config.textColor
      }}
    >
      <div style={{ marginTop: '2px', flexShrink: 0 }}>
         {config.icon}
      </div>
      
      <div style={{ flex: 1 }}>
        <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.025em', color: config.headerColor, marginBottom: '4px' }}>
          {alert.type === 'ALLERGY' ? 'Allergie Majeure' : 'Alerte Médicale'}
        </h4>
        <p style={{ fontWeight: 500, fontSize: '1rem', margin: 0 }}>
          {alert.description}
        </p>
      </div>

      {canResolve && alert.status === 'active' && (
        <button 
          onClick={() => resolveAlert(alert.id)}
          style={{ 
            flexShrink: 0, 
            padding: '8px', 
            background: 'none', 
            border: 'none', 
            color: config.textColor, 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '0.875rem', 
            fontWeight: 500,
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
          title="Marquer comme résolu"
        >
          <XCircle size={18} />
          <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>Résoudre</span>
        </button>
      )}
    </div>
  );
}
