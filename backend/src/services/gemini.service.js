import { config } from '../config/env.js';

/**
 * Gemini AI Service Stub
 * Prepared for emergency assessment, triage dispatch, and multilingual broadcast synthesis
 */
export class GeminiService {
  constructor() {
    this.apiKey = config.geminiApiKey;
  }

  isConfigured() {
    return Boolean(this.apiKey);
  }

  /**
   * Triage incident reports based on citizen descriptions
   * @param {string} reportText 
   */
  async triageIncident(reportText) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key is not configured in environment variables');
    }
    // Future implementation: call @google/genai or Gemini REST API
    return {
      severity: 'HIGH',
      summary: 'Automated triage pending model invocation',
      suggestedResources: ['Ambulance', 'Rescue Team']
    };
  }
}

export default new GeminiService();
