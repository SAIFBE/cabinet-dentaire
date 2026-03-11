import { usePrescriptions } from '../../context/PrescriptionContext';
import { generateId } from '../../../../lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../../shared/components/Button';
import { ResponsiveTableWrapper } from '../../../../shared/components/ResponsiveTableWrapper';

export function MedicationTable() {
  const { activePrescription, updateDraft } = usePrescriptions();

  if (!activePrescription) return null;
  const isFinalized = activePrescription.status !== 'draft';
  const meds = activePrescription.medications || [];

  const handleAddRow = () => {
    updateDraft({
      medications: [
        ...meds,
        { id: generateId(), name: '', dosage: '', form: 'Comprimé', frequency: '', duration: '', instructions: '' }
      ]
    });
  };

  const handleRemoveRow = (id) => {
    updateDraft({
      medications: meds.filter(m => m.id !== id)
    });
  };

  const handleChange = (id, field, value) => {
    updateDraft({
      medications: meds.map(m => m.id === id ? { ...m, [field]: value } : m)
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Prescription Médicamenteuse</h3>
        {!isFinalized && (
           <Button size="sm" onClick={handleAddRow}>
             <Plus size={16} /> Ajouter Ligne
           </Button>
        )}
      </div>

      {meds.length === 0 ? (
        <div className="empty-state" style={{ padding: '30px' }}>
           Aucun médicament ajouté. Sélectionnez un modèle ou ajoutez une ligne.
        </div>
      ) : (
        <ResponsiveTableWrapper>
          <table className="data-table" style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Médicament *</th>
                <th style={{ width: '15%' }}>Dosage *</th>
                <th style={{ width: '15%' }}>Forme *</th>
                <th style={{ width: '20%' }}>Posologie *</th>
                <th style={{ width: '15%' }}>Durée *</th>
                {!isFinalized && <th style={{ width: '10%', textAlign: 'center' }}>Supprimer</th>}
              </tr>
            </thead>
            <tbody>
              {meds.map((med, index) => (
                <MedicationRow 
                  key={med.id || index}
                  med={med}
                  isFinalized={isFinalized}
                  onChange={(field, val) => handleChange(med.id, field, val)}
                  onRemove={() => handleRemoveRow(med.id)}
                />
              ))}
            </tbody>
          </table>
        </ResponsiveTableWrapper>
      )}
    </div>
  );
}

function MedicationRow({ med, isFinalized, onChange, onRemove }) {
  if (isFinalized) {
    return (
      <tr>
        <td><strong>{med.name}</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{med.instructions}</span></td>
        <td>{med.dosage}</td>
        <td>{med.form}</td>
        <td>{med.frequency}</td>
        <td>{med.duration}</td>
      </tr>
    );
  }

  // Draft mode editable row
  return (
    <>
      <tr style={{ background: 'var(--color-bg)' }}>
        <td style={{ padding: '8px' }}>
          <input 
            type="text" className="form-input" placeholder="Ex: Amoxicilline"
            value={med.name} onChange={(e) => onChange('name', e.target.value)}
            style={{ width: '100%', marginBottom: '4px' }}
            required
          />
          <input 
             type="text" className="form-input" placeholder="Notes (ex: prendre au repas)"
             title="Instructions complémentaires"
             value={med.instructions || ''} onChange={(e) => onChange('instructions', e.target.value)}
             style={{ width: '100%', fontSize: '0.8rem', padding: '4px' }}
          />
        </td>
        <td style={{ padding: '8px', verticalAlign: 'top' }}>
          <input 
            type="text" className="form-input" placeholder="Ex: 500mg"
            value={med.dosage} onChange={(e) => onChange('dosage', e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </td>
        <td style={{ padding: '8px', verticalAlign: 'top' }}>
           <select 
             className="form-select"
             value={med.form} onChange={(e) => onChange('form', e.target.value)}
             style={{ width: '100%' }}
             required
           >
              <option value="Comprimé">Comprimé</option>
              <option value="Gélule">Gélule</option>
              <option value="Sachet">Sachet</option>
              <option value="Bain de bouche">Bain de bouche</option>
              <option value="Sirop">Sirop</option>
              <option value="Gel">Gel</option>
              <option value="Ampoule">Ampoule</option>
              <option value="Autre">Autre</option>
           </select>
        </td>
        <td style={{ padding: '8px', verticalAlign: 'top' }}>
          <input 
            type="text" className="form-input" placeholder="Ex: 3 fois/jour"
            value={med.frequency} onChange={(e) => onChange('frequency', e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </td>
        <td style={{ padding: '8px', verticalAlign: 'top' }}>
          <input 
            type="text" className="form-input" placeholder="Ex: 7 jours"
            value={med.duration} onChange={(e) => onChange('duration', e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </td>
        <td style={{ padding: '8px', verticalAlign: 'top', textAlign: 'center' }}>
           <button 
             type="button" 
             className="icon-btn" 
             onClick={onRemove}
             style={{ color: 'var(--color-danger)', marginTop: '6px' }}
             title="Supprimer la ligne"
           >
             <Trash2 size={18} />
           </button>
        </td>
      </tr>
    </>
  );
}
