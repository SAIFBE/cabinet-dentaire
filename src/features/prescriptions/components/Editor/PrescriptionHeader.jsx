import { usePrescriptions } from '../../context/PrescriptionContext';
import { usePrescriptionTemplates } from '../../hooks/usePrescriptionTemplates';
import { formatDate } from '../../../../lib/utils';
import { Calendar, User } from 'lucide-react';

export function PrescriptionHeader() {
  const { activePrescription, patient, applyTemplate, updateDraft } = usePrescriptions();
  const { templates } = usePrescriptionTemplates();

  if (!activePrescription || !patient) return null;

  const isFinalized = activePrescription.status !== 'draft';

  return (
    <div style={{ 
      padding: '24px', 
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-bg)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }}>
      {/* Left: Patient & Context */}
      <div>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: 'var(--color-text)' }}>
          {patient.firstName} {patient.lastName}
        </h2>
        
        <div style={{ display: 'flex', gap: '16px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} /> 
            {isFinalized ? (
              <span>Date: {formatDate(activePrescription.date)}</span>
            ) : (
              <input 
                 type="date"
                 className="form-input"
                 style={{ padding: '4px', fontSize: '0.85rem', width: 'auto' }}
                 value={activePrescription.date}
                 onChange={(e) => updateDraft({ date: e.target.value })}
                 title="Date de l'ordonnance"
              />
            )}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} /> Dr. {activePrescription.doctorName || '...'}
          </span>
        </div>
      </div>

      {/* Right: Actions / Status */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ marginBottom: '12px' }}>
          <StatusBadge status={activePrescription.status} />
        </div>

        {!isFinalized && (
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Modèles :</label>
             <select 
               className="form-select"
               style={{ padding: '6px 10px', fontSize: '0.85rem', width: '220px' }}
               value={activePrescription.templateType || ''}
               onChange={(e) => {
                 if (e.target.value) applyTemplate(e.target.value);
               }}
             >
               <option value="" disabled>-- Choisir un modèle --</option>
               {templates.map(t => (
                 <option key={t.id} value={t.id}>{t.label}</option>
               ))}
               <option value="custom" disabled>Personnalisée</option>
             </select>
           </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    draft: { label: 'Brouillon', class: 'warning' },
    finalized: { label: 'Finalisée', class: 'success' },
    printed: { label: 'Mise en main / Imprimée', class: 'info' }
  };
  const config = map[status] || map.draft;
  return (
     <span className={`badge badge--${config.class}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
       {config.label}
     </span>
  );
}
