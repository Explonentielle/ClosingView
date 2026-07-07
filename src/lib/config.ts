/**
 * Configuration basée sur l'environnement
 */

export const getAuthRedirectUrl = (path: string = '/dashboard'): string => {
  // En développement local
  if (import.meta.env.DEV) {
    // Utilise le port réel du dev server (par défaut 5173 avec Vite)
    return `${window.location.origin}${path}`;
  }

  // En production
  return `${window.location.origin}${path}`;
};

export const getResetPasswordUrl = (): string => {
  if (import.meta.env.DEV) {
    return `${window.location.origin}/auth/callback`;
  }
  return `${window.location.origin}/auth/callback`;
};

export const getGoogleRedirectUrl = (): string => {
  if (import.meta.env.DEV) {
    return `${window.location.origin}/dashboard`;
  }
  return `${window.location.origin}/dashboard`;
};

/**
 * URLs autorisées pour Supabase
 * À configurer dans: Supabase Dashboard > Authentication > URL Configuration
 */
export const AUTHORIZED_URLS = {
  development: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ],
  production: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
  ],
};

export const config = {
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_URL || window.location.origin,
};
