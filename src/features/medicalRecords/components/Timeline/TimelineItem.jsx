import React from 'react';
import { Activity, Camera, FileCheck, Stethoscope, FileText, CheckCircle } from 'lucide-react';
import { formatDate } from '../../../../lib/utils';
import { useTranslation } from 'react-i18next';

/**
 * A wrapper for a single event in the vertical timeline.
 * Supports different visuals depending on `eventType`.
 */
export function TimelineItem({ event }) {
  const { t } = useTranslation();

  // Determine Icon and Color Map based on polymorphic eventType
  // Determine Icon and Color Map based on polymorphic eventType
  const getEventStyle = (type) => {
    switch (type) {
      case 'CONSULTATION':
        return {
          icon: <Stethoscope size={20} color="var(--color-primary)" />,
          bgColor: 'var(--color-primary-100)',
          borderColor: 'var(--color-primary-light)'
        };
      case 'RADIOLOGY':
        return {
          icon: <Camera size={20} color="#2563eb" />,
          bgColor: '#dbeafe',
          borderColor: '#bfdbfe'
        };
      case 'PRESCRIPTION':
        return {
          icon: <FileCheck size={20} color="#9333ea" />,
          bgColor: '#f3e8ff',
          borderColor: '#e9d5ff'
        };
      case 'TREATMENT':
        return {
          icon: <Activity size={20} color="#16a34a" />,
          bgColor: '#dcfce7',
          borderColor: '#bbf7d0'
        };
      default:
        return {
          icon: <FileText size={20} color="var(--color-text-secondary)" />,
          bgColor: 'var(--color-bg)',
          borderColor: 'var(--color-border)'
        };
    }
  };

  const style = getEventStyle(event.eventType);

  // Parse inner data based on event source
  const renderContentBody = () => {
    if (event.eventType === 'CONSULTATION') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          {event.chiefComplaint && (
            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
               <span style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginRight: '8px' }}>Motif:</span> 
               {event.chiefComplaint}
            </div>
          )}
          {event.observations && (
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text)', backgroundColor: 'var(--color-bg)', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', whiteSpace: 'pre-line' }}>
              {event.observations}
            </div>
          )}
          {event.performedTreatments && (
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
               <CheckCircle size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
               <span>{event.performedTreatments}</span>
            </div>
          )}
          {event.linkedTeeth && event.linkedTeeth.length > 0 && (
             <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Dents:</span>
                {event.linkedTeeth.map(t => (
                  <span key={t} style={{ padding: '2px 8px', backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #bfdbfe', fontWeight: 500 }}>
                    {t}
                  </span>
                ))}
             </div>
          )}
        </div>
      );
    } 
    
    if (event.eventType === 'RADIOLOGY') {
      return (
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--color-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <div style={{ width: '64px', height: '48px', backgroundColor: 'var(--color-border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
             <Camera size={24} color="var(--color-text-light)" />
          </div>
          <div>
            <h5 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '0 0 4px 0' }}>{event.title || event.data?.category || 'Image radiologique'}</h5>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>{event.notes || event.data?.diagnosis || 'Aucune description fournie.'}</p>
          </div>
        </div>
      );
    }

    if (event.eventType === 'PRESCRIPTION') {
      return (
        <div style={{ marginTop: '8px', fontSize: '0.875rem', color: 'var(--color-text)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
             <span style={{ fontWeight: 500 }}>{event.data?.medicationCount} médicament(s) prescrit(s)</span>
          </div>
          {event.data?.notes && (
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', margin: 0 }}>Note : {event.data.notes}</p>
          )}
        </div>
      );
    }

    return <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Détails indisponibles.</p>;
  };

  return (
    <div style={{ position: 'relative', paddingLeft: '48px', paddingBottom: '32px' }}>
      {/* Vertical Line Connector */}
      <div style={{ position: 'absolute', left: '20px', top: '32px', bottom: 0, width: '1px', backgroundColor: 'var(--color-border)' }} className="timeline-connector"></div>
      
      {/* Icon Circle */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${style.borderColor}`, backgroundColor: style.bgColor, boxShadow: '0 0 0 4px white', zIndex: 10 }}>
        {style.icon}
      </div>

      {/* Card Content */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', padding: '16px', transition: 'box-shadow 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--color-text)', textTransform: 'capitalize', margin: '0 0 4px 0' }}>
              {t(`medicalRecords.eventTypes.${event.eventType}`, event.eventType.toLowerCase())}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
               {formatDate(event.date || event.sortDate)} • {event.practitionerId === 'admin' ? 'Dr. Sarah Mitchell' : 'Cabinet'}
            </span>
          </div>
          {event.status === 'draft' && (
             <span className="badge badge--warning" style={{ fontSize: '10px' }}>
               Brouillon
             </span>
          )}
        </div>

        {renderContentBody()}
      </div>
    </div>
  );
}
