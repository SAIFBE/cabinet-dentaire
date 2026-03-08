import React from 'react';
import { CheckCircle2, Circle, Activity } from 'lucide-react';
import { useMedicalRecords } from '../../context/MedicalRecordContext';
import { formatDate } from '../../../../lib/utils';
import { Card } from '../../../../shared/components/Card';

export function TreatmentPlanWidget() {
  const { treatmentPlan, isLoading } = useMedicalRecords();

  if (isLoading) return null;

  const activePlan = treatmentPlan.filter(
    (item) => item.status === 'planned' || item.status === 'in_progress'
  );

  return (
    <Card style={{ marginTop: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}>
        <h3 style={{ fontWeight: 'bold', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <Activity size={18} color="var(--color-primary)" />
          Plan de Traitement
        </h3>
      </div>
      
      <div style={{ padding: '16px' }}>
        {activePlan.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', textAlign: 'center', margin: '16px 0' }}>Aucun soin en attente.</p>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: 0, padding: 0, listStyle: 'none' }}>
            {activePlan.map((item) => (
              <li key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                {/* Visual Status Indicator */}
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  {item.status === 'in_progress' ? (
                     <span style={{ position: 'relative', display: 'flex', height: '16px', width: '16px' }}>
                     <span style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#60a5fa', opacity: 0.75 }}></span>
                     <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '16px', width: '16px', backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center' }}>
                       <span style={{ height: '6px', width: '6px', backgroundColor: 'white', borderRadius: '50%' }}></span>
                     </span>
                   </span>
                  ) : (
                    <Circle size={16} color="var(--color-border)" />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 0 4px 0' }}>
                    {item.toothNumber && <span style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)', marginRight: '8px', borderRight: '1px solid var(--color-border)', paddingRight: '8px' }}>{item.toothNumber}</span>}
                    {item.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--color-text-light)', letterSpacing: '0.05em' }}>
                      {formatDate(item.createdAt)}
                    </span>
                    <span style={{ 
                      fontSize: '0.625rem', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase',
                      backgroundColor: item.priority === 'high' ? '#fef2f2' : 'var(--color-bg)',
                      color: item.priority === 'high' ? '#dc2626' : 'var(--color-text-secondary)',
                      border: item.priority === 'high' ? '1px solid #fee2e2' : 'none'
                    }}>
                      {item.priority === 'high' ? 'Urgent' : 'Normal'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
