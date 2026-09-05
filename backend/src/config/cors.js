import { config } from './env.js';

/**
 * Validates if an incoming origin is permitted.
 * Supports:
 * - FRONTEND_URL / CLIENT_URL specified in environment (can be comma-separated)
 * - Localhost and 127.0.0.1 (any port for development)
 * - Any Vercel deployment domain (*.vercel.app)
 * - Server-to-server / non-browser requests without origin header
 */
export const isOriginAllowed = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/+$/, '');

  const configuredOrigins = (config.clientUrl || '')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  // Match configured origins or wildcard
  if (configuredOrigins.includes(normalizedOrigin) || configuredOrigins.includes('*')) {
    return true;
  }

  // Allow local development origins
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
    return true;
  }

  // Allow Vercel production and preview subdomains
  if (/^https:\/\/[a-zA-Z0-9_\-.]+\.vercel\.app$/.test(normalizedOrigin)) {
    return true;
  }

  return false;
};

export const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
