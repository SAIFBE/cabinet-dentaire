import { mockServer } from './mockServer';
import { randomDelay } from '../../lib/utils';

export const radiologyApi = {
  async getAll(patientId) {
    await randomDelay();
    return mockServer.getRadiologyImages(patientId);
  },

  async upload(data) {
    await randomDelay();
    return mockServer.addRadiologyImage(data);
  },

  async remove(id) {
    await randomDelay();
    return mockServer.deleteRadiologyImage(id);
  },
};
