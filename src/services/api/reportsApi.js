import { mockServer } from './mockServer';
import { randomDelay } from '../../lib/utils';

export const reportsApi = {
  async getData() {
    await randomDelay();
    return mockServer.getReportsData();
  },
};
