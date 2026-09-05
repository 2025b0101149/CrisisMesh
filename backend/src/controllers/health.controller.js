import { getDBStatus } from '../config/db.js';
import { config } from '../config/env.js';

/**
 * Controller to handle API health check
 * @route GET /api/health
 */
export const checkHealth = (req, res) => {
  const uptimeSeconds = process.uptime();
  const dbStatus = getDBStatus();

  res.status(200).json({
    status: 'ok',
    service: 'CrisisMesh API Service',
    tagline: 'AI-Powered Emergency Response & Resource Coordination Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptimeSeconds)} seconds`,
    environment: config.nodeEnv,
    database: {
      status: dbStatus.state,
      connected: dbStatus.isConnected,
      error: dbStatus.error || undefined
    },
    integrations: {
      geminiAi: Boolean(config.geminiApiKey),
      mapbox: Boolean(config.mapboxAccessToken),
      googleMaps: Boolean(config.googleMapsApiKey)
    }
  });
};
