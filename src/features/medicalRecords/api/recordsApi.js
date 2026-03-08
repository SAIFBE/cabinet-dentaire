import { mockServer } from '../../../services/api/mockServer';

/**
 * Service pour interagir avec l'API des dossiers médicaux.
 */
export const recordsApi = {
  // --- MEDICAL PROFILE ---
  /**
   * Récupère le profil médical permanent (alertes, antécédents médicaux) du patient.
   */
  getMedicalProfile: async (patientId) => {
    return mockServer.getMedicalProfile(patientId);
  },

  /**
   * Met à jour le profil médical permanent (remplace ou fusionne).
   */
  updateMedicalProfile: async (patientId, payload) => {
    return mockServer.updateMedicalProfile(patientId, payload);
  },

  /**
   * Ajoute une nouvelle alerte critique (raccourci).
   */
  createAlert: async (patientId, payload) => {
    return mockServer.createMedicalAlert(patientId, payload);
  },

  /**
   * Marque une alerte spécifique comme résolue (Admin/Dentist only).
   */
  resolveAlert: async (patientId, alertId) => {
    return mockServer.resolveMedicalAlert(patientId, alertId);
  },

  // --- CLINICAL TIMELINE & NOTES ---
  /**
   * Récupère TOUS les événements combinés de la Timeline (Consultations, Radios, Ordonnances, etc) pour un patient, triés par date décroissante.
   */
  getTimelineEvents: async (patientId) => {
    return mockServer.getTimelineEvents(patientId);
  },

  /**
   * Récupère uniquement les notes de consultation brutes d'un patient.
   */
  getConsultationNotes: async (patientId) => {
     return mockServer.getConsultationNotes(patientId);
  },

  /**
   * Obtient les détails d'une note spécifique.
   */
  getConsultationNoteById: async (noteId) => {
     return mockServer.getConsultationNoteById(noteId);
  },

  /**
   * Crée un brouillon de note de consultation.
   */
  createConsultationNote: async (payload) => {
    return mockServer.createConsultationNote(payload);
  },

  /**
   * Met à jour un brouillon de consultation.
   */
  updateConsultationNote: async (noteId, payload) => {
    return mockServer.updateConsultationNote(noteId, payload);
  },

  /**
   * Verrouille la consultation (Statut -> finalized)
   */
  finalizeConsultationNote: async (noteId, role) => {
    return mockServer.finalizeConsultationNote(noteId, role);
  },
  
  /**
   * Supprime/Archive une consultation (Admin uniquement)
   */
  deleteConsultationNote: async (noteId, role) => {
      return mockServer.deleteConsultationNote(noteId, role);
  },

  // --- TREATMENT PLAN ---
  /**
   * Récupère le plan de traitement actif/historique d'un patient.
   */
  getTreatmentPlan: async (patientId) => {
      return mockServer.getTreatmentPlan(patientId);
  },

  createTreatmentPlanItem: async (payload) => {
      return mockServer.createTreatmentPlanItem(payload);
  },

  updateTreatmentPlanItem: async (itemId, payload) => {
      return mockServer.updateTreatmentPlanItem(itemId, payload);
  },

  deleteTreatmentPlanItem: async (itemId) => {
      return mockServer.deleteTreatmentPlanItem(itemId);
  }
};
