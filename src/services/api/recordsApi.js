import { mockServer } from '../../services/api/mockServer';

/**
 * Service pour interagir avec l'API des dossiers médicaux (Legacy/Global).
 * Note: See src/features/medicalRecords/api/recordsApi.js for the new module specific implementation.
 */
export const recordsApi = {
  getAll: async (patientId) => {
    return mockServer.getMedicalDocuments(patientId);
  },

  create: async (payload) => {
    return mockServer.addMedicalDocument(payload);
  },

  delete: async (id) => {
    return mockServer.deleteMedicalDocument(id);
  }
};
