import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { prescriptionsApi } from '../../../services/api/prescriptionsApi';
import { patientsApi } from '../../../services/api/patientsApi';
import { useAuth } from '../../../security/auth/useAuth';
import { generateId } from '../../../lib/utils';
import { usePrescriptionTemplates } from '../hooks/usePrescriptionTemplates';

const PrescriptionContext = createContext(null);

export function PrescriptionProvider({ children, initialPatientId = null }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { getTemplate } = usePrescriptionTemplates();

  const [patientId, setPatientId] = useState(initialPatientId);
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [activePrescription, setActivePrescription] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load patient data and their prescription history
  const loadPatientData = useCallback(async (id) => {
    if (!id) {
      setPatient(null);
      setHistory([]);
      setActivePrescription(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const p = await patientsApi.getById(id);
      setPatient(p);

      const h = await prescriptionsApi.getByPatient(id);
      setHistory(h || []);

      // Automatically prep a blank draft if no active prescription is set
      createNewDraft(p);
      
    } catch (err) {
      console.error('Error loading patient prescriptions:', err);
      setError('Impossible de charger les données du patient.');
      setPatient(null);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setPatientId(initialPatientId);
  }, [initialPatientId]);

  useEffect(() => {
    loadPatientData(patientId);
  }, [patientId, loadPatientData]);

  // Create a brand new empty draft
  const createNewDraft = (pat = patient) => {
    if (!pat) return;
    setActivePrescription({
      patientId: pat.id,
      patientName: `${pat.firstName} ${pat.lastName}`,
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      templateType: '',
      medications: [],
      generalInstructions: '',
      notes: ''
    });
  };

  // View a historical prescription (read-only mode)
  const viewHistoricalPrescription = async (id) => {
    try {
      setIsLoading(true);
      const presc = await prescriptionsApi.getById(id);
      setActivePrescription(presc);
    } catch (err) {
      setError("Impossible de charger l'ordonnance sélectionnée.");
    } finally {
       setIsLoading(false);
    }
  };

  // Apply a template to the current active draft
  const applyTemplate = (templateId) => {
    if (!activePrescription || activePrescription.status !== 'draft') return;
    
    // Warn if overwriting existing meds (handled in UI, but safe here)
    const template = getTemplate(templateId);
    if (!template) return;

    setActivePrescription(prev => ({
      ...prev,
      templateType: templateId,
      medications: template.medications.map(m => ({ ...m, id: generateId() })), // clone with new IDs
      generalInstructions: prev.generalInstructions ? `${prev.generalInstructions}\n\n${template.generalInstructions}` : template.generalInstructions
    }));
  };

  const updateDraft = (updates) => {
     if (activePrescription?.status !== 'draft') return;
     setActivePrescription(prev => ({ ...prev, ...updates }));
  };

  const saveDraft = async () => {
    if (!activePrescription || activePrescription.status !== 'draft') return null;
    
    setIsSaving(true);
    setError(null);
    try {
      let savedResult;
      if (activePrescription.id) {
         // Update existing draft
         savedResult = await prescriptionsApi.update(activePrescription.id, activePrescription);
      } else {
         // Create new draft
         savedResult = await prescriptionsApi.create(patientId, activePrescription);
      }
      setActivePrescription(savedResult);
      // Reload history to reflect the updated mock server state globally
      const h = await prescriptionsApi.getByPatient(patientId);
      setHistory(h);
      return savedResult;
    } catch (err) {
      setError("Erreur lors de la sauvegarde du brouillon.");
      console.error(err);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const finalizePrescription = async () => {
    if (!activePrescription || activePrescription.status !== 'draft') return null;

    // Must be admin to finalize (enforced by UI and API, but safe check)
    if (user?.role !== 'admin') {
      setError("Seul un dentiste peut finaliser une ordonnance.");
      return null;
    }

    setIsSaving(true);
    setError(null);
    try {
      // Ensure it's saved first if it's a new unsaved draft
      let targetId = activePrescription.id;
      if (!targetId) {
         const saved = await prescriptionsApi.create(patientId, activePrescription);
         targetId = saved.id;
      } else {
         await prescriptionsApi.update(targetId, activePrescription); // ensure latest edits are caught
      }

      // Now finalize
      const finalized = await prescriptionsApi.finalize(targetId);
      setActivePrescription(finalized);
      
      const h = await prescriptionsApi.getByPatient(patientId);
      setHistory(h);
      
      return finalized;
    } catch (err) {
      setError("Erreur lors de la finalisation.");
      console.error(err);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const deletePrescription = async (id) => {
     if (user?.role !== 'admin') return;
     try {
        setIsSaving(true);
        await prescriptionsApi.delete(id);
        const h = await prescriptionsApi.getByPatient(patientId);
        setHistory(h);
        if (activePrescription?.id === id) {
           createNewDraft();
        }
     } catch (err) {
        setError("Erreur lors de la suppression.");
     } finally {
        setIsSaving(false);
     }
  };

  const duplicateAsNewDraft = async (id) => {
    // Take a historical one and make a draft
    try {
      setIsSaving(true);
      const duplicate = await prescriptionsApi.duplicate(id);
      setActivePrescription(duplicate);
      const h = await prescriptionsApi.getByPatient(patientId);
      setHistory(h);
    } catch (err) {
      setError("Erreur lors de la duplication.");
    } finally {
      setIsSaving(false);
    }
  };

  const changePatient = (newId) => {
    if (activePrescription && activePrescription.status === 'draft' && activePrescription.medications.length > 0 && !activePrescription.id) {
       // A quick warning bypass for simplicity in MVP. Real app might show a modal.
       const confirm = window.confirm("Vous avez un brouillon non enregistré. Voulez-vous vraiment changer de patient ?");
       if (!confirm) return;
    }
    setPatientId(newId);
  };

  const value = {
    patientId,
    patient,
    history,
    activePrescription,
    isLoading,
    isSaving,
    error,
    changePatient,
    createNewDraft,
    viewHistoricalPrescription,
    applyTemplate,
    updateDraft,
    saveDraft,
    finalizePrescription,
    deletePrescription,
    duplicateAsNewDraft,
    dismissError: () => setError(null)
  };

  return (
    <PrescriptionContext.Provider value={value}>
      {children}
    </PrescriptionContext.Provider>
  );
}

export function usePrescriptions() {
  const context = useContext(PrescriptionContext);
  if (!context) {
    throw new Error('usePrescriptions must be used within a PrescriptionProvider');
  }
  return context;
}
