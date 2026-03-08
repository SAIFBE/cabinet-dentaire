import React, { useState } from 'react';
import { TimelineItem } from './TimelineItem';
import { useMedicalRecords } from '../../context/MedicalRecordContext';
import { Button } from '../../../../shared/components/Button';
import { FileText, Plus } from 'lucide-react';

export function ClinicalTimeline() {
  const { timelineEvents, isLoading, startNewNote } = useMedicalRecords();
  const [filter, setFilter] = useState('ALL');

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Synchronisation du fil clinique...</div>;
  }

  // Derived Filtered List
  const filteredEvents = timelineEvents.filter(event => {
    if (filter === 'ALL') return true;
    return event.eventType === filter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sticky Header with Filters */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--color-border)', padding: '16px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <FilterPill label="Tout" active={filter === 'ALL'} onClick={() => setFilter('ALL')} />
          <FilterPill label="Consultations" active={filter === 'CONSULTATION'} onClick={() => setFilter('CONSULTATION')} />
          <FilterPill label="Radios" active={filter === 'RADIOLOGY'} onClick={() => setFilter('RADIOLOGY')} />
          <FilterPill label="Ordonnances" active={filter === 'PRESCRIPTION'} onClick={() => setFilter('PRESCRIPTION')} />
        </div>
        
        <Button onClick={startNewNote} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Nouvelle Note
        </Button>
      </div>

      {/* Feed Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: 'var(--color-bg)' }}>
        {filteredEvents.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '80px 0' }}>
             <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
               <FileText size={32} color="var(--color-text-light)" />
             </div>
             <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>Aucun événement clinique</h3>
             <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Ce dossier ne contient pas encore d'entrée pour les filtres sélectionnés.</p>
           </div>
        ) : (
          <div style={{ maxWidth: '768px', margin: '0 auto', paddingTop: '8px' }}>
            {filteredEvents.map(event => (
              <TimelineItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Small helper for rounded toggles
function FilterPill({ label, active, onClick }) {
  const activeStyle = active ? {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    borderColor: 'var(--color-primary-dark)',
    boxShadow: 'var(--shadow-sm)'
  } : {
    backgroundColor: 'white',
    color: 'var(--color-text-secondary)',
    borderColor: 'var(--color-border)'
  };
  
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 16px',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 500,
        transition: 'all 0.2s',
        border: '1px solid',
        cursor: 'pointer',
        ...activeStyle
      }}
    >
      {label}
    </button>
  );
}
