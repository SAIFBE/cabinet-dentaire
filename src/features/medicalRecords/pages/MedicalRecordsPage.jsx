import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../security/auth/useAuth';
import { patientsApi } from '../../../services/api/patientsApi';
import { Spinner } from '../../../shared/components/Spinner';
import { Alert } from '../../../shared/components/Alert';
import { Button } from '../../../shared/components/Button';
import { ArrowLeft, FileText } from 'lucide-react';

// Context
import { MedicalRecordProvider, useMedicalRecords } from '../context/MedicalRecordContext';

// Components
import { MedicalSummaryCard } from '../components/Summary/MedicalSummaryCard';
import { CriticalAlertBanner } from '../components/Summary/CriticalAlertBanner';
import { ClinicalTimeline } from '../components/Timeline/ClinicalTimeline';
import { ConsultationForm } from '../components/Timeline/ConsultationForm';
import { TreatmentPlanWidget } from '../components/TreatmentPlan/TreatmentPlanWidget';

/**
 * Inner Layout that consumes the Context.
 */
function MedicalRecordsLayoutInner({ patient }) {
  const { medicalProfile, isLoading, error } = useMedicalRecords();
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="p-8">
        <Alert type="error" message={error} />
        <Button onClick={() => navigate(-1)} className="mt-4">Retour</Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', overflow: 'hidden' }}>
      
      {/* Main Split-Pane Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Panel: Static Safety Data */}
        <div style={{ 
          width: '340px', 
          flexShrink: 0, 
          borderRight: '1px solid var(--color-border)', 
          backgroundColor: 'var(--color-bg)', 
          padding: '16px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px' 
        }}>
          
          {/* Inject Dynamic Alerts */}
          {medicalProfile?.alerts?.filter(a => a.status === 'active').map(alert => (
            <CriticalAlertBanner key={alert.id} alert={alert} />
          ))}

          <MedicalSummaryCard patient={patient} />

          <TreatmentPlanWidget />
        </div>

        {/* Right Panel: Active Feed & Input */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          minWidth: 0, 
          backgroundColor: 'var(--color-bg-card)', 
          boxShadow: 'inset 1px 0 0 0 var(--color-bg)' 
        }}>
           {/* The Feed */}
           <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
             <ClinicalTimeline />
           </div>

           {/* The Input Dock (Rises up when activeDraft exists) */}
           <div style={{ flexShrink: 0, zIndex: 30, position: 'relative' }}>
             <ConsultationForm />
           </div>
        </div>

      </div>
    </div>
  );
}

/**
 * Entry Wrapper that validates params, fetches the Patient,
 * and sets up the MedicalRecordProvider.
 */
export function MedicalRecordsPage() {
  const { id: urlPatientId } = useParams();
  
  const [patientsList, setPatientsList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(urlPatientId || '');
  const [activePatient, setActivePatient] = useState(null);
  
  const [loading, setLoading] = useState(true);

  // 1. Fetch all patients for the dropdown
  useEffect(() => {
    const loadPatients = async () => {
       try {
         const data = await patientsApi.getAll();
         setPatientsList(data);
         
         if (urlPatientId) {
            const exists = data.find(p => p.id === urlPatientId);
            if (exists) setSelectedPatientId(urlPatientId);
         }
       } catch (e) {
         console.error(e);
       } finally {
         setLoading(false);
       }
    };
    loadPatients();
  }, [urlPatientId]);

  // 2. Fetch specific patient details when selection changes
  useEffect(() => {
     if (!selectedPatientId) return;
     const loadActivePatient = async () => {
        try {
           const p = await patientsApi.getById(selectedPatientId);
           setActivePatient(p);
        } catch (e) {
           console.error(e);
        }
     };
     loadActivePatient();
  }, [selectedPatientId]);


  if (loading) return <Spinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--color-bg)' }}>
      {/* Top Bar for global patient selection */}
      <div className="page-header" style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {urlPatientId && (
            <button 
              onClick={() => window.history.back()}
              className="btn btn--secondary"
              style={{ padding: '6px' }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h2 className="page-header__title">Dossiers Médicaux</h2>
            <p className="page-header__subtitle">
              {activePatient ? `Patient • ${activePatient.firstName} ${activePatient.lastName}` : 'Sélectionnez un patient'}
            </p>
          </div>
        </div>

        {/* Global Patient Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
             Patient sélectionné
          </label>
          <select 
            className="form-select"
            value={selectedPatientId} 
            onChange={(e) => setSelectedPatientId(e.target.value)} 
            style={{ width: '250px', backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
          >
            <option value="" disabled>Rechercher un patient...</option>
            {patientsList.map((p) => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {!selectedPatientId || !activePatient ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.6 }}>
             <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <FileText size={40} color="var(--color-text-secondary)" />
             </div>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>Aucun patient sélectionné</h3>
             <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px' }}>
                Veuillez sélectionner un patient en haut à droite pour accéder à son dossier médical central.
             </p>
          </div>
        ) : (
          <MedicalRecordProvider patientId={activePatient.id} key={activePatient.id}>
            <MedicalRecordsLayoutInner patient={activePatient} />
          </MedicalRecordProvider>
        )}
      </div>
    </div>
  );
}
