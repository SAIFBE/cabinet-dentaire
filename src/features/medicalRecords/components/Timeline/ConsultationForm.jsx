import React, { useState, useEffect } from 'react';
import { Save, Check, X } from 'lucide-react';
import { useMedicalRecords } from '../../context/MedicalRecordContext';
import { useAuth } from '../../../../security/auth/useAuth';
import { Button } from '../../../../shared/components/Button';
import { Alert } from '../../../../shared/components/Alert';

export function ConsultationForm() {
  const { activeDraft, saveDraft, finalizeNote, cancelDraft } = useMedicalRecords();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    observations: '',
    clinicalAssessment: '',
    performedTreatments: '',
    linkedTeeth: '' // simplified CSV input for MVP
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Sync form with active draft context
  useEffect(() => {
    if (activeDraft) {
      setFormData({
        chiefComplaint: activeDraft.chiefComplaint || '',
        observations: activeDraft.observations || '',
        clinicalAssessment: activeDraft.clinicalAssessment || '',
        performedTreatments: activeDraft.performedTreatments || '',
        linkedTeeth: activeDraft.linkedTeeth?.join(', ') || ''
      });
    }
  }, [activeDraft]);

  if (!activeDraft) return null;

  const isSecretary = user?.role === 'secretary';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      
      const payload = {
        ...formData,
        linkedTeeth: formData.linkedTeeth.split(',').map(t => t.trim()).filter(Boolean)
      };
      
      await saveDraft(payload);
    } catch (err) {
      setSaveError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalize = async () => {
    if (!formData.chiefComplaint) {
       setSaveError("Le motif de consultation est obligatoire.");
       return;
    }
    
    try {
      setIsSaving(true);
      await handleSaveDraft(); // Save latest state first
      await finalizeNote();    // Then lock it
    } catch (err) {
      setSaveError(err.message || 'Erreur lors de la finalisation');
      setIsSaving(false);
    }
  };

  if (isSecretary) {
    return (
       <div style={{ backgroundColor: 'white', padding: '24px', borderTop: '1px solid var(--color-border)' }}>
          <Alert type="warning" message="Les secrétaires ne sont pas autorisées à rédiger des notes cliniques." />
          <Button variant="secondary" onClick={cancelDraft} style={{ marginTop: '16px' }}>Fermer</Button>
       </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', borderTop: '1px solid var(--color-border)', boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', maxHeight: '50vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
        <h3 style={{ fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Nouvelle Note de Consultation</h3>
        <button onClick={cancelDraft} style={{ color: 'var(--color-text-light)', background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>
      
      <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {saveError && <Alert type="error" message={saveError} onClose={() => setSaveError(null)} />}
        
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>Motif principal *</label>
          <input 
            type="text"
            name="chiefComplaint"
            value={formData.chiefComplaint}
            onChange={handleChange}
            placeholder="Ex: Douleur au froid..."
            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>Observations cliniques</label>
            <textarea 
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              rows={3}
              placeholder="Constatations visuelles, tests..."
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', outline: 'none', resize: 'vertical' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>Actes réalisés</label>
            <textarea 
              name="performedTreatments"
              value={formData.performedTreatments}
              onChange={handleChange}
              rows={3}
              placeholder="Détail de l'intervention..."
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', outline: 'none', resize: 'vertical' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>Évaluation / Diagnostic</label>
            <input 
              type="text"
              name="clinicalAssessment"
              value={formData.clinicalAssessment}
              onChange={handleChange}
              placeholder="Ex: Pulpite irréversible"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>Dents concernées (séparées par virgule)</label>
            <input 
              type="text"
              name="linkedTeeth"
              value={formData.linkedTeeth}
              onChange={handleChange}
              placeholder="Ex: 46, 47"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', outline: 'none' }}
            />
          </div>
        </div>
      </div>
      
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Brouillon non visible par les autres praticiens.</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="ghost" onClick={handleSaveDraft} disabled={isSaving} style={{ display: 'flex', alignItems: 'center' }}>
             <Save size={16} style={{ marginRight: '8px' }}/> 
             {isSaving ? 'Sauvegarde...' : 'Sauvegarder Brouillon'}
          </Button>
          <Button variant="primary" onClick={handleFinalize} disabled={isSaving || user?.role !== 'admin'} style={{ display: 'flex', alignItems: 'center' }}>
             <Check size={16} style={{ marginRight: '8px' }}/> 
             Signer & Finaliser
          </Button>
        </div>
      </div>
    </div>
  );
}
