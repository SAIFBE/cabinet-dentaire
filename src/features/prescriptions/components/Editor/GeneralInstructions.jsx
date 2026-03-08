import { usePrescriptions } from '../../context/PrescriptionContext';

export function GeneralInstructions() {
  const { activePrescription, updateDraft } = usePrescriptions();

  if (!activePrescription) return null;
  const isFinalized = activePrescription.status !== 'draft';

  return (
    <div style={{ padding: '24px', borderTop: '1px solid var(--color-border)' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600 }}>
        Instructions Générales & Notes
      </h3>
      
      {isFinalized ? (
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'var(--color-bg-hover)', 
          borderRadius: '6px',
          whiteSpace: 'pre-wrap',
          fontSize: '0.9rem'
        }}>
          {activePrescription.generalInstructions || <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Aucune instruction supplémentaire.</span>}
        </div>
      ) : (
        <textarea 
          className="form-input"
          style={{ width: '100%', minHeight: '100px', resize: 'vertical', padding: '12px' }}
          placeholder="Ex: Ne pas manger d'aliments chauds pendant 24h..."
          value={activePrescription.generalInstructions || ''}
          onChange={(e) => updateDraft({ generalInstructions: e.target.value })}
        />
      )}
      
      {/* Internal Clinic Notes (Not printed on prescription, just for medical record) */}
      <h3 style={{ margin: '20px 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
        Notes internes (non imprimées)
      </h3>
      {isFinalized ? (
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          {activePrescription.notes || <i>Aucune note interne.</i>}
        </p>
      ) : (
        <input 
          type="text" 
          className="form-input"
          style={{ width: '100%', fontSize: '0.85rem' }}
          placeholder="Justification clinique, contexte..."
          value={activePrescription.notes || ''}
          onChange={(e) => updateDraft({ notes: e.target.value })}
        />
      )}
    </div>
  );
}
