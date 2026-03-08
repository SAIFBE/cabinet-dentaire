/**
 * Auth API — SECURITY: generic error messages only, no user enumeration.
 */

import { mockServer } from './mockServer';
import { randomDelay } from '../../lib/utils';

export const authApi = {
  async login({ username, password }) {
    await randomDelay();
    const result = mockServer.login(username, password);
    if (!result.success) {
      // SECURITY: Generic error — never reveals if user exists
      throw new Error('Invalid credentials');
    }
    return result;
  },

  logout() {
    mockServer.logout();
  },
};
