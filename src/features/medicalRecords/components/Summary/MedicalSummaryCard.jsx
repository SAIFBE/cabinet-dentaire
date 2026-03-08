import React from 'react';
import { Activity, Thermometer, User, Calendar, Stethoscope, Hash, Edit3 } from 'lucide-react';
import { useAuth } from '../../../../security/auth/useAuth';
import { Card } from '../../../../shared/components/Card';
import { Button } from '../../../../shared/components/Button';
import { formatDate } from '../../../../lib/utils';
import { useMedicalRecords } from '../../context/MedicalRecordContext';

export function MedicalSummaryCard({ patient }) {
  const { user } = useAuth();
  const { medicalProfile, timelineEvents, isLoading } = useMedicalRecords();

  const canEdit = user?.role === 'admin' || user?.role === 'assistant';

  // Extract last visit from the timeline (which is sorted decs)
  const lastConsultation = timelineEvents?.find(e => e.eventType === 'CONSULTATION');

  if (isLoading || !patient) {
    return (
      <Card>
         <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Chargement du profil...</div>
      </Card>
    );
  }

  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: 0 }}>
      {/* Header Profile Info */}
      <div style={{ backgroundColor: 'var(--color-bg)', padding: '20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--color-primary-100)' }}>
          <User size={32} color="var(--color-primary)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
            {patient.firstName} {patient.lastName}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14}/> Né(e) le {formatDate(patient.dateOfBirth)}</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Hash size={14}/> #{patient.id.replace('p', '')}</span>
          </div>
        </div>
      </div>

      {/* Body: Synthesized Stats */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        
        {/* Quick KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
           <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', padding: '12px', border: '1px solid #dbeafe' }}>
              <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Dernière visite</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>{lastConsultation ? formatDate(lastConsultation.date) : 'Aucune'}</span>
           </div>
           <div style={{ backgroundColor: '#f3e8ff', borderRadius: '8px', padding: '12px', border: '1px solid #e9d5ff' }}>
              <span style={{ fontSize: '0.75rem', color: '#9333ea', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Assurance</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>{patient.insurance || 'Non renseignée'}</span>
           </div>
        </div>

        {/* Structured Medical Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           
           <ProfileSection 
             title="Allergies connues" 
             items={medicalProfile?.allergies} 
             icon={<Activity size={16} color="var(--color-danger)" />} 
           />
           
           <ProfileSection 
             title="Traitements Médicaux (Fond)" 
             items={medicalProfile?.backgroundMedications} 
             icon={<Thermometer size={16} color="#f97316" />} 
           />

           <ProfileSection 
             title="Pathologies Chroniques" 
             items={medicalProfile?.chronicConditions} 
             icon={<Stethoscope size={16} color="var(--color-primary)" />} 
           />

           {medicalProfile?.surgicalHistory && (
             <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Antécédents chirurgicaux</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', backgroundColor: 'var(--color-bg)', padding: '12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                  {medicalProfile.surgicalHistory}
                </p>
             </div>
           )}

           {medicalProfile?.riskFactors && medicalProfile.riskFactors.length > 0 && (
             <div>
               <h4 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Facteurs de risque</h4>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                 {medicalProfile.riskFactors.map((r, i) => (
                   <span key={i} className="badge badge--warning">
                     {r}
                   </span>
                 ))}
               </div>
             </div>
           )}

        </div>
      </div>

      {/* Footer Actions */}
      {canEdit && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
          <Button variant="secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '0.875rem', backgroundColor: 'white' }}>
            <Edit3 size={16} /> Mettre à jour le profil
          </Button>
        </div>
      )}
    </Card>
  );
}

// Utility sub-component
function ProfileSection({ title, items, icon }) {
  if (!items || items.length === 0) return null;
  
  return (
    <div>
      <h4 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon}
        {title}
      </h4>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-text-light)', marginTop: '8px', flexShrink: 0 }}></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
