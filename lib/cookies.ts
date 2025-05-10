import Cookies from 'js-cookie';

// Cookie names
export const COOKIE_NAMES = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LAST_VISIT: 'last_visit',
  NOTIFICATION_DISMISSED: 'notification_dismissed',
} as const;

// Cookie options
const DEFAULT_COOKIE_OPTIONS = {
  expires: 365, // 1 year
  path: '/',
  sameSite: 'strict' as const,
};

// User preferences interface
export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

// Cookie management functions
export const cookieManager = {
  // Set a cookie
  set: (name: string, value: string | object, options = {}) => {
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
    Cookies.set(name, valueToStore, { ...DEFAULT_COOKIE_OPTIONS, ...options });
  },

  // Get a cookie
  get: (name: string) => {
    const value = Cookies.get(name);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return value;
    }
  },

  // Remove a cookie
  remove: (name: string, options = {}) => {
    Cookies.remove(name, { ...DEFAULT_COOKIE_OPTIONS, ...options });
  },

  // Set user preferences
  setUserPreferences: (preferences: Partial<UserPreferences>) => {
    const currentPreferences = cookieManager.get(COOKIE_NAMES.USER_PREFERENCES) || {};
    cookieManager.set(COOKIE_NAMES.USER_PREFERENCES, {
      ...currentPreferences,
      ...preferences,
    });
  },

  // Get user preferences
  getUserPreferences: (): UserPreferences => {
    return cookieManager.get(COOKIE_NAMES.USER_PREFERENCES) || {
      theme: 'light',
      notifications: true,
      language: 'en',
    };
  },

  // Set theme
  setTheme: (theme: 'light' | 'dark') => {
    cookieManager.set(COOKIE_NAMES.THEME, theme);
  },

  // Get theme
  getTheme: (): 'light' | 'dark' => {
    return cookieManager.get(COOKIE_NAMES.THEME) || 'light';
  },

  // Set last visit
  setLastVisit: () => {
    cookieManager.set(COOKIE_NAMES.LAST_VISIT, new Date().toISOString());
  },

  // Get last visit
  getLastVisit: (): Date | null => {
    const lastVisit = cookieManager.get(COOKIE_NAMES.LAST_VISIT);
    return lastVisit ? new Date(lastVisit) : null;
  },

  // Set notification dismissed
  setNotificationDismissed: (value: boolean) => {
    cookieManager.set(COOKIE_NAMES.NOTIFICATION_DISMISSED, value.toString());
  },

  // Get notification dismissed
  getNotificationDismissed: (): boolean => {
    return cookieManager.get(COOKIE_NAMES.NOTIFICATION_DISMISSED) === 'true';
  },
}; 