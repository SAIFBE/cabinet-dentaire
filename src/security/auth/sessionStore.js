/**
 * Session Store — SECURITY: Only stores non-sensitive flags in sessionStorage.
 * NO TOKENS are ever stored. Only:
 * - isLoggedIn: "1" flag
 * - role: user role string
 * - name: display name
 */

const KEYS = {
  IS_LOGGED_IN: 'dentacare_logged_in',
  ROLE: 'dentacare_role',
  NAME: 'dentacare_name',
};

export const sessionStore = {
  save(user) {
    try {
      sessionStorage.setItem(KEYS.IS_LOGGED_IN, '1');
      sessionStorage.setItem(KEYS.ROLE, user.role || '');
      sessionStorage.setItem(KEYS.NAME, user.name || '');
    } catch {
      // sessionStorage not available — fail silently
    }
  },

  restore() {
    try {
      const isLoggedIn = sessionStorage.getItem(KEYS.IS_LOGGED_IN);
      if (isLoggedIn !== '1') return null;
      return {
        role: sessionStorage.getItem(KEYS.ROLE) || '',
        name: sessionStorage.getItem(KEYS.NAME) || '',
      };
    } catch {
      return null;
    }
  },

  clear() {
    try {
      sessionStorage.removeItem(KEYS.IS_LOGGED_IN);
      sessionStorage.removeItem(KEYS.ROLE);
      sessionStorage.removeItem(KEYS.NAME);
    } catch {
      // fail silently
    }
  },
};
