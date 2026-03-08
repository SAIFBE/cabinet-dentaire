import { mockServer } from './mockServer';

export const prescriptionsApi = {
  // Get all prescriptions for a specific patient
  getByPatient: async (patientId) => {
    return mockServer.getPrescriptionsByPatient(patientId);
  },

  // Get a specific prescription by ID
  getById: async (id) => {
    return mockServer.getPrescriptionById(id);
  },

  // Create a new prescription
  create: async (patientId, data) => {
    return mockServer.createPrescription(patientId, data);
  },

  // Update a prescription (must be in 'draft' status)
  update: async (id, data) => {
    return mockServer.updatePrescription(id, data);
  },

  // Finalize a prescription (changes status to 'finalized')
  finalize: async (id) => {
    return mockServer.finalizePrescription(id);
  },

  // Delete a prescription
  delete: async (id) => {
    return mockServer.deletePrescription(id);
  },
  
  // Duplicate a finalized prescription to a new draft
  duplicate: async (id) => {
     return mockServer.duplicatePrescription(id);
  }
};
