import api from './api.js';

/**
 * Fetch health status from backend API
 * Measures roundtrip response latency
 */
export const fetchHealthStatus = async () => {
  const startTime = performance.now();
  try {
    const response = await api.get('/health');
    const endTime = performance.now();
    return {
      success: true,
      data: response.data,
      latency: Math.round(endTime - startTime)
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      success: false,
      error: error.message || 'Unable to connect to CrisisMesh backend server',
      latency: Math.round(endTime - startTime)
    };
  }
};
