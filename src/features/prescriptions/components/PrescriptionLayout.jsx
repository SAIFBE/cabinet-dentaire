import { usePrescriptions } from '../context/PrescriptionContext';

import { PrescriptionHeader } from './Editor/PrescriptionHeader';
import { MedicationTable } from './Editor/MedicationTable';
import { GeneralInstructions } from './Editor/GeneralInstructions';
import { PrescriptionActions } from './Actions/PrescriptionActions';
import { PatientHistorySidebar } from './Sidebar/PatientHistorySidebar';
import { Spinner } from '../../../shared/components/Spinner';
import { Alert } from '../../../shared/components/Alert';

export function PrescriptionLayout() {
  const { patientId, patient, activePrescription, isLoading, error } = usePrescriptions();

  if (isLoading && !patient) {
     return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>;
  }

  // Allergy active check
  const hasPenicillinAllergy = patient && patient.notes?.toLowerCase().includes('allergie') && patient.notes?.toLowerCase().includes('pénicilline');

  return (
    <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 150px)', overflow: 'hidden' }}>
      
      {/* LEFT PANE : EDITOR */}
      <div className="print-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', backgroundColor: 'var(--color-bg-card)', position: 'relative' }}>
         
         {!patientId ? (
            <div className="empty-state" style={{ margin: 'auto' }}>
               <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Espace Ordonnances</h3>
               <p>Sélectionnez un patient via la barre supérieure pour commencer.</p>
            </div>
         ) : !activePrescription ? (
            <div className="empty-state" style={{ margin: 'auto' }}>
               <Spinner /> <p>Chargement du brouillon...</p>
            </div>
         ) : (
            <>
              {error && <div style={{ padding: '16px 24px 0 24px' }}><Alert type="error" message={error} /></div>}
              {hasPenicillinAllergy && (
                 <div style={{ padding: '12px 24px', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderBottom: '1px solid var(--color-warning)', color: 'var(--color-warning)' }}>
                   <strong>⚠ Attention :</strong> Allergie potentielle détectée dans le dossier (Pénicilline).
                 </div>
              )}
              
              {/* THE PRINTABLE TICKET */}
              <div id="prescription-paper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <PrescriptionHeader />
                <div style={{ flex: 1 }}>
                  <MedicationTable />
                  <GeneralInstructions />
                </div>
              </div>

              {/* ACTION FOOTER */}
              <PrescriptionActions />
            </>
         )}

      </div>

      {/* RIGHT PANE : HISTORY (Hidden during print) */}
      <div className="no-print" style={{ display: 'flex' }}>
         <PatientHistorySidebar />
      </div>

    </div>
  );
}
