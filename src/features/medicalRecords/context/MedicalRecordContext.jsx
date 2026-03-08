import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { recordsApi } from '../api/recordsApi';
import { useAuth } from '../../../security/auth/useAuth';

const MedicalRecordContext = createContext(null);

export function MedicalRecordProvider({ patientId, children }) {
  const { user } = useAuth();
  
  // Data States
  const [medicalProfile, setMedicalProfile] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [treatmentPlan, setTreatmentPlan] = useState([]);
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Note Editor State
  const [activeDraft, setActiveDraft] = useState(null);

  const loadMedicalData = useCallback(async () => {
    if (!patientId) return;
    try {
      setIsLoading(true);
      setError(null);
      const [profile, events, plan] = await Promise.all([
        recordsApi.getMedicalProfile(patientId),
        recordsApi.getTimelineEvents(patientId),
        recordsApi.getTreatmentPlan(patientId)
      ]);
      setMedicalProfile(profile);
      setTimelineEvents(events || []);
      setTreatmentPlan(plan || []);
    } catch (err) {
      console.error("Failed to load medical records:", err);
      setError("Impossible de charger le dossier médical.");
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadMedicalData();
  }, [loadMedicalData]);

  // --- ACTIONS: PROFILE & ALERTS ---
  const updateProfile = async (payload) => {
    try {
      const updated = await recordsApi.updateMedicalProfile(patientId, payload);
      setMedicalProfile(updated);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil.");
      throw err;
    }
  };

  const addAlert = async (payload) => {
    try {
      await recordsApi.createAlert(patientId, payload);
      await loadMedicalData(); // Refresh to catch new timeline events
    } catch (err) {
      setError("Erreur lors de l'ajout de l'alerte.");
      throw err;
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      if (user?.role !== 'admin') throw new Error('Action non autorisée');
      await recordsApi.resolveAlert(patientId, alertId);
      await loadMedicalData();
    } catch (err) {
      setError("Erreur lors de la résolution de l'alerte.");
      throw err;
    }
  };

  // --- ACTIONS: CONSULTATION NOTES ---
  const saveDraft = async (payload) => {
    try {
      let savedNote;
      if (activeDraft?.id) {
        savedNote = await recordsApi.updateConsultationNote(activeDraft.id, payload);
      } else {
        savedNote = await recordsApi.createConsultationNote({ ...payload, patientId });
      }
      setActiveDraft(savedNote);
      await loadMedicalData(); // Update timeline
      return savedNote;
    } catch (err) {
      setError("Erreur lors de l'enregistrement du brouillon.");
      throw err;
    }
  };

  const finalizeNote = async () => {
    try {
      if (!activeDraft?.id) return;
      await recordsApi.finalizeConsultationNote(activeDraft.id);
      setActiveDraft(null); // Clear editor
      await loadMedicalData(); // Refresh timeline to show finalized note
    } catch (err) {
      setError("Impossible de finaliser la note.");
      throw err;
    }
  };

  const startNewNote = () => {
    setActiveDraft({
       patientId,
       practitionerId: user?.id,
       chiefComplaint: '',
       symptoms: '',
       observations: '',
       clinicalAssessment: '',
       performedTreatments: '',
       followUpRecommendation: '',
       linkedRadiologyIds: [],
       linkedPrescriptionIds: [],
       linkedTeeth: [],
       status: 'draft'
    });
  };

  const cancelDraft = () => {
    setActiveDraft(null);
  };

  // --- ACTIONS: TREATMENT PLAN ---
  const addTreatment = async (payload) => {
    try {
       await recordsApi.createTreatmentPlanItem({ ...payload, patientId });
       await loadMedicalData();
    } catch (err) {
       setError("Erreur lors de l'ajout au plan.");
       throw err;
    }
  };

  const updateTreatment = async (itemId, payload) => {
    try {
       await recordsApi.updateTreatmentPlanItem(itemId, payload);
       await loadMedicalData();
    } catch (err) {
       setError("Erreur lors de la mise à jour du plan.");
       throw err;
    }
  };

  const value = {
    patientId,
    medicalProfile,
    timelineEvents,
    treatmentPlan,
    isLoading,
    error,
    activeDraft,
    
    // Actions
    refreshData: loadMedicalData,
    updateProfile,
    addAlert,
    resolveAlert,
    
    // Editor Actions
    startNewNote,
    saveDraft,
    finalizeNote,
    cancelDraft,
    setActiveDraft,
    
    // Plan Actions
    addTreatment,
    updateTreatment
  };

  return (
    <MedicalRecordContext.Provider value={value}>
      {children}
    </MedicalRecordContext.Provider>
  );
}

export const useMedicalRecords = () => {
  const context = useContext(MedicalRecordContext);
  if (!context) {
    throw new Error('useMedicalRecords must be used within a MedicalRecordProvider');
  }
  return context;
};
