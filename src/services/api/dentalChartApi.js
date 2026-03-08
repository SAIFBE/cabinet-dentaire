import { mockServer } from './mockServer';
import { randomDelay } from '../../lib/utils';

export const dentalChartApi = {
  async getChartByPatient(patientId) {
    await randomDelay();
    return mockServer.getDentalChart(patientId);
  },

  async createChartIfMissing(patientId, ageCategory) {
    await randomDelay();
    return mockServer.createDentalChart(patientId, ageCategory);
  },

  async updateTooth(patientId, toothNumber, patch) {
    await randomDelay();
    return mockServer.updateDentalTooth(patientId, toothNumber, patch);
  },
};
