import { mockServer } from './mockServer';
import { randomDelay } from '../../lib/utils';

export const patientsApi = {
  async getAll() {
    await randomDelay();
    return mockServer.getPatients();
  },

  async getById(id) {
    await randomDelay();
    return mockServer.getPatientById(id);
  },

  async create(data) {
    await randomDelay();
    return mockServer.addPatient(data);
  },

  async update(id, data) {
    await randomDelay();
    return mockServer.updatePatient(id, data);
  },

  async remove(id) {
    await randomDelay();
    return mockServer.deletePatient(id);
  },
};
