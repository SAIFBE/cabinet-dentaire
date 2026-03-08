import { usePrescriptions } from '../../context/PrescriptionContext';
import { formatDate } from '../../../../lib/utils';
import { FileText, FileCheck, RefreshCw, Printer } from 'lucide-react';

export function PatientHistorySidebar() {
  const { history, activePrescription, viewHistoricalPrescription, createNewDraft, duplicateAsNewDraft, patient } = usePrescriptions();

  if (!patient) {
    return (
       <div style={{ width: '300px', backgroundColor: 'var(--color-bg)', borderLeft: '1px solid var(--color-border)', padding: '24px' }}>
          <p className="empty-state">Sélectionnez un patient.</p>
       </div>
    );
  }

  return (
    <div style={{ width: '300px', backgroundColor: 'var(--color-bg)', borderLeft: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)' }}>
         <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Historique Patient</h3>
         <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
           {history.length} ordonnance(s)
         </p>
      </div>

      <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
         <button 
           className="btn btn--primary" 
           style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
           onClick={() => createNewDraft(patient)}
           disabled={activePrescription && activePrescription.status === 'draft' && !activePrescription.id && activePrescription.medications.length === 0}
         >
           <FileText size={16} /> Nouveau Brouillon
         </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
         {history.length === 0 ? (
            <p className="empty-state">Aucun historique d'ordonnance trouvé pour ce patient.</p>
         ) : (
            history.map(item => (
              <HistoryCard 
                key={item.id} 
                item={item} 
                isActive={activePrescription?.id === item.id}
                onClick={() => viewHistoricalPrescription(item.id)}
                onDuplicate={(e) => { e.stopPropagation(); duplicateAsNewDraft(item.id); }}
              />
            ))
         )}
      </div>

    </div>
  );
}

function HistoryCard({ item, isActive, onClick, onDuplicate }) {
  const isDraft = item.status === 'draft';
  const isPrinted = item.status === 'printed';

  return (
    <div 
      onClick={onClick}
      style={{ 
        padding: '16px', 
        backgroundColor: isActive ? 'var(--color-bg)' : 'var(--color-bg-card)', 
        border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: isActive ? '0 0 0 1px var(--color-primary)' : 'none',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
         <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>
           {formatDate(item.date)}
         </span>
         {isDraft ? (
           <span title="Brouillon"><FileText size={16} color="var(--color-warning)" /></span>
         ) : isPrinted ? (
           <span title="Imprimée"><Printer size={16} color="var(--color-info)" /></span>
         ) : (
           <span title="Finalisée"><FileCheck size={16} color="var(--color-success)" /></span>
         )}
      </div>
      
      <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
         Médicaments: {item.medications.length}
      </p>

      {!isDraft && (
         <button 
           className="icon-btn" 
           style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '4px' }}
           onClick={onDuplicate}
           title="Dupliquer cette ordonnance pour aujourd'hui"
         >
           <RefreshCw size={12} /> Renouveler
         </button>
      )}
    </div>
  );
}
