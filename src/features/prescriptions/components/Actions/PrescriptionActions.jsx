import { usePrescriptions } from '../../context/PrescriptionContext';
import { usePrescriptionPdf } from '../../hooks/usePrescriptionPdf';
import { useAuth } from '../../../../security/auth/useAuth';
import { Button } from '../../../../shared/components/Button';
import { Save, Printer, CheckCircle, Copy, AlertCircle } from 'lucide-react';
import { prescriptionSchema } from '../../types/prescriptionSchema';

export function PrescriptionActions() {
  const { activePrescription, isSaving, saveDraft, finalizePrescription, duplicateAsNewDraft, error } = usePrescriptions();
  const { printPrescription } = usePrescriptionPdf();
  const { user } = useAuth();

  if (!activePrescription) return null;

  const isFinalized = activePrescription.status !== 'draft';
  const isAdmin = user?.role === 'admin';

  // Validation Check before attempting action
  const isDraftValid = () => {
    try {
      prescriptionSchema.parse(activePrescription);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleFinalize = async () => {
    if (!isDraftValid()) {
      alert("Veuillez remplir tous les champs obligatoires (médicaments, dosages, etc.) avant de finaliser.");
      return;
    }
    const confirm = window.confirm("Après finalisation, l'ordonnance ne pourra plus être modifiée. Continuer ?");
    if (confirm) {
      await finalizePrescription();
    }
  };

  const handleSaveDraft = async () => {
    await saveDraft();
  };

  return (
    <div style={{ 
      padding: '16px 24px', 
      borderTop: '1px solid var(--color-border)', 
      backgroundColor: 'var(--color-bg)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {error && <span style={{ color: 'var(--color-danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} /> {error}</span>}
        {isSaving && <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Sauvegarde en cours...</span>}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {isFinalized ? (
          <>
            <Button variant="secondary" onClick={() => duplicateAsNewDraft(activePrescription.id)}>
              <Copy size={16} /> Dupliquer comme Brouillon
            </Button>
            <Button onClick={() => printPrescription(activePrescription)}>
               <Printer size={16} /> Imprimer l'Ordonnance
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={handleSaveDraft} disabled={isSaving}>
              <Save size={16} /> {activePrescription.id ? 'Mettre à jour le Brouillon' : 'Sauvegarder Brouillon'}
            </Button>
            
            {/* Finalize is restricted to admin (dentist) */}
            {isAdmin && (
              <Button onClick={handleFinalize} disabled={isSaving || activePrescription.medications.length === 0} title="Signer et vérouiller le document">
                <CheckCircle size={16} /> Finaliser & Signer
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
