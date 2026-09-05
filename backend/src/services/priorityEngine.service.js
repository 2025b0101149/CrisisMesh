/**
 * CrisisMesh Emergency Priority Engine
 * 
 * Deterministic, transparent calculation of emergency priority scores (0 to 100).
 * 
 * Factor Weighting (Total potential up to 100 pts, clamped to [0, 100]):
 * 1. Severity & Disaster Type (Up to 30 pts)
 * 2. Number of People Affected (Up to 20 pts)
 * 3. Medical Urgency & Casualties (Up to 25 pts)
 * 4. Children / Elderly / Vulnerable Populations (Up to 15 pts)
 * 5. Environmental Conditions & Hazards (Up to 10 pts)
 * 6. Resource Availability & Scarcity (Up to 10 pts)
 * 
 * Classification Tiers:
 * - 80 - 100 = CRITICAL (🔴)
 * - 60 - 79  = HIGH     (🟠)
 * - 40 - 59  = MEDIUM   (🟡)
 * - 0 - 39   = LOW      (🟢)
 */

export const PRIORITY_TIERS = {
  CRITICAL: { label: 'CRITICAL', min: 80, max: 100, symbol: '🔴', color: 'red' },
  HIGH:     { label: 'HIGH',     min: 60, max: 79,  symbol: '🟠', color: 'orange' },
  MEDIUM:   { label: 'MEDIUM',   min: 40, max: 59,  symbol: '🟡', color: 'yellow' },
  LOW:      { label: 'LOW',      min: 0,  max: 39,  symbol: '🟢', color: 'green' }
};

/**
 * Classify a numerical score into the exact 4 crisis tiers
 * @param {number} score 
 * @returns {'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'}
 */
export function classifyPriorityTier(score) {
  const rounded = Math.round(score);
  if (rounded >= 80) return 'CRITICAL';
  if (rounded >= 60) return 'HIGH';
  if (rounded >= 40) return 'MEDIUM';
  return 'LOW';
}

/**
 * Calculate deterministic priority score, classification level, and human-readable reasons.
 * 
 * @param {Object} incident 
 * @param {Object} [environmentContext]
 * @param {Object} [resourceContext]
 * @returns {{ score: number, level: string, reasons: string[], breakdown: Object }}
 */
export function calculatePriorityScore(incident = {}, environmentContext = {}, resourceContext = {}) {
  const reasons = [];
  const breakdown = {};

  // -------------------------------------------------------------
  // 1. Severity Factor (Base Disaster Type & Hazard Magnitude) [Max: 30 pts]
  // -------------------------------------------------------------
  let severityScore = 0;
  const emergencyType = incident.emergencyType || incident.category || 'Other';
  const desc = (incident.description || '').toLowerCase();

  const typeWeights = {
    'Structural Collapse': 25,
    'Hazardous Materials': 25,
    'Wildfire': 22,
    'Fire': 22,
    'Mass Transit': 22,
    'Flood': 22,
    'Medical': 20,
    'Utility Failure': 18,
    'Other': 10
  };

  severityScore += (typeWeights[emergencyType] !== undefined) ? typeWeights[emergencyType] : 10;

  // Active hazard amplifier keywords
  const criticalKeywords = ['trapped', 'explosion', 'toxic', 'unconscious', 'spreading', 'collapse', 'rapidly', 'heavy smoke', 'outage', 'hazard', 'fire', 'brush'];
  const hasCriticalKeyword = criticalKeywords.some((kw) => desc.includes(kw));
  if (hasCriticalKeyword) {
    severityScore += 5;
  }

  // Explicit user-selected urgency override
  if (incident.urgency === 'critical') {
    severityScore = Math.max(severityScore, 26);
  } else if (incident.urgency === 'urgent') {
    severityScore += 4;
  }

  severityScore = Math.min(30, Math.max(0, severityScore));
  breakdown.severity = {
    score: severityScore,
    max: 30,
    reason: `${emergencyType} incident hazard profile`
  };

  if (severityScore >= 20) {
    reasons.push(`+ Severe hazard type: ${emergencyType}`);
  }

  // -------------------------------------------------------------
  // 2. Number of People Affected [Max: 20 pts]
  // -------------------------------------------------------------
  let affectedScore = 0;
  const peopleAffected = Number(incident.peopleAffected || incident.affectedCount || 0);

  if (peopleAffected >= 50) {
    affectedScore = 20;
    reasons.push(`+ Large number of people affected (${peopleAffected}+ individuals endangered)`);
  } else if (peopleAffected >= 20) {
    affectedScore = 15;
    reasons.push(`+ Large number of people affected (${peopleAffected} individuals)`);
  } else if (peopleAffected >= 10) {
    affectedScore = 12;
    reasons.push(`+ Large number of people affected (${peopleAffected} people)`);
  } else if (peopleAffected >= 5) {
    affectedScore = 8;
    reasons.push(`+ Multiple people affected (${peopleAffected} people)`);
  } else if (peopleAffected >= 1) {
    affectedScore = 4;
  }

  breakdown.peopleAffected = {
    score: affectedScore,
    max: 20,
    count: peopleAffected,
    reason: `${peopleAffected} people affected`
  };

  // -------------------------------------------------------------
  // 3. Medical Urgency & Critical Casualties [Max: 25 pts]
  // -------------------------------------------------------------
  let medicalScore = 0;
  const isMedicalEmergency = Boolean(
    incident.isMedicalEmergency ||
    incident.urgency === 'critical' ||
    emergencyType === 'Medical'
  );
  const peopleInjured = Number(incident.peopleInjured || incident.casualties?.injured || 0);
  const peopleTrapped = Number(incident.peopleTrapped || incident.casualties?.trapped || 0);
  const criticalCasualties = Number(incident.criticalCasualties || incident.casualties?.critical || 0);

  if (isMedicalEmergency) {
    medicalScore += 10;
  }

  if (criticalCasualties >= 3) {
    medicalScore += 15;
    reasons.push(`+ Medical emergency (${criticalCasualties} life-threatening casualties)`);
  } else if (criticalCasualties >= 1) {
    medicalScore += 10;
    reasons.push(`+ Medical emergency with critical casualties (${criticalCasualties} critical)`);
  } else if (isMedicalEmergency) {
    reasons.push(`+ Medical emergency`);
  }

  if (peopleTrapped >= 3) {
    medicalScore += 10;
    reasons.push(`+ High number of trapped victims (${peopleTrapped} individuals requiring extrication)`);
  } else if (peopleTrapped >= 1) {
    medicalScore += 6;
    reasons.push(`+ Trapped individuals requiring technical rescue (${peopleTrapped} trapped)`);
  }

  if (peopleInjured >= 5 && criticalCasualties === 0) {
    medicalScore += 8;
    reasons.push(`+ Multiple injured persons requiring medical response (${peopleInjured} injured)`);
  } else if (peopleInjured >= 1 && criticalCasualties === 0 && peopleTrapped === 0) {
    medicalScore += 6;
    reasons.push(`+ Injured individuals on scene (${peopleInjured} injured)`);
  }

  medicalScore = Math.min(25, Math.max(0, medicalScore));
  breakdown.medicalUrgency = {
    score: medicalScore,
    max: 25,
    isMedical: isMedicalEmergency,
    injured: peopleInjured,
    trapped: peopleTrapped,
    critical: criticalCasualties,
    reason: `${criticalCasualties} critical, ${peopleTrapped} trapped, ${peopleInjured} injured`
  };

  // -------------------------------------------------------------
  // 4. Children, Elderly & Vulnerable Populations [Max: 15 pts]
  // -------------------------------------------------------------
  let vulnerableScore = 0;
  const vul = incident.vulnerablePopulation || {};
  const childrenCount = Number(vul.childrenCount || incident.childrenCount || 0);
  const elderlyCount = Number(vul.elderlyCount || incident.elderlyCount || 0);
  const disabledCount = Number(vul.disabledCount || incident.disabledCount || 0);
  const hasVulnerable = Boolean(
    vul.hasVulnerable ||
    incident.hasVulnerablePeople ||
    childrenCount > 0 ||
    elderlyCount > 0 ||
    disabledCount > 0 ||
    desc.includes('child') ||
    desc.includes('elderly') ||
    desc.includes('infant') ||
    desc.includes('school') ||
    desc.includes('nursing home') ||
    desc.includes('hospital')
  );

  const totalVulnerableCount = childrenCount + elderlyCount + disabledCount;

  if (totalVulnerableCount >= 5 || (childrenCount > 0 && elderlyCount > 0)) {
    vulnerableScore = 15;
    reasons.push(`+ High-risk vulnerable populations endangered (children & elderly present)`);
  } else if (hasVulnerable || totalVulnerableCount >= 1) {
    vulnerableScore = 10;
    if (childrenCount > 0) {
      reasons.push(`+ Children endangered in incident perimeter (${childrenCount} children)`);
    } else if (elderlyCount > 0) {
      reasons.push(`+ Elderly individuals in distress (${elderlyCount} elderly)`);
    } else {
      reasons.push(`+ Vulnerable population endangered (children/elderly/mobility-impaired)`);
    }
  }

  breakdown.vulnerablePopulations = {
    score: vulnerableScore,
    max: 15,
    hasVulnerable,
    totalCount: totalVulnerableCount,
    reason: hasVulnerable ? 'Vulnerable populations identified' : 'None reported'
  };

  // -------------------------------------------------------------
  // 5. Environmental Conditions & Secondary Hazards [Max: 10 pts]
  // -------------------------------------------------------------
  let envScore = 0;
  const env = { ...environmentContext, ...(incident.environmentalConditions || {}) };
  const weather = (env.weather || '').toLowerCase();
  const isNight = Boolean(env.isNight);
  const secondaryHazards = env.secondaryHazards || env.hazards || [];

  const severeWeatherKeywords = ['storm', 'hurricane', 'tornado', 'blizzard', 'heavy rain', 'flood surge', 'gale', 'wind', 'freezing'];
  const hasSevereWeather = severeWeatherKeywords.some((w) => weather.includes(w)) ||
                           severeWeatherKeywords.some((w) => desc.includes(w));

  if (hasSevereWeather) {
    envScore += 6;
    reasons.push(`+ Severe environmental weather conditions impeding response`);
  }

  if (isNight || desc.includes('dark') || desc.includes('night')) {
    envScore += 2;
  }

  if (secondaryHazards.length > 0 || desc.includes('secondary') || desc.includes('aftershock') || desc.includes('gas leak')) {
    envScore += 4;
    reasons.push(`+ Secondary environmental hazard threats detected`);
  }

  envScore = Math.min(10, Math.max(0, envScore));
  breakdown.environmentalConditions = {
    score: envScore,
    max: 10,
    weather: env.weather || 'Normal',
    isNight,
    secondaryHazards,
    reason: envScore > 0 ? 'Adverse weather or secondary hazard risks' : 'Favorable environmental conditions'
  };

  // -------------------------------------------------------------
  // 6. Resource Availability & Logistics Strain [Max: 10 pts]
  // -------------------------------------------------------------
  let resourceScore = 0;
  const res = { ...resourceContext, ...(incident.resourceContext || {}) };

  // Sector or regional ambulance scarcity
  const availableAmbulances = res.availableAmbulances !== undefined ? Number(res.availableAmbulances) : null;
  const sectorAmbulances = res.sectorAvailableAmbulances !== undefined ? Number(res.sectorAvailableAmbulances) : null;
  const hospitalCapacityPercent = res.hospitalCapacityPercent !== undefined ? Number(res.hospitalCapacityPercent) : null;
  const rescueTeamsAvailable = res.rescueTeamsAvailable !== undefined ? Number(res.rescueTeamsAvailable) : null;

  if (sectorAmbulances === 0 || availableAmbulances === 0) {
    resourceScore += 6;
    reasons.push(`+ Limited nearby resources (0 ambulances available in sector)`);
  } else if (availableAmbulances !== null && availableAmbulances <= 3) {
    resourceScore += 4;
    reasons.push(`+ Limited nearby resources (critical fleet strain)`);
  }

  if (hospitalCapacityPercent !== null && hospitalCapacityPercent >= 85) {
    resourceScore += 3;
    reasons.push(`+ Regional hospital & ICU bed saturation`);
  }

  if (rescueTeamsAvailable === 0 && ['Structural Collapse', 'Flood'].includes(emergencyType)) {
    resourceScore += 4;
    reasons.push(`+ Specialized rescue teams unavailable in immediate vicinity`);
  }

  // If resources are explicitly passed as constrained flag
  if (incident.limitedResources || res.isScarcity) {
    resourceScore = Math.max(resourceScore, 6);
    if (!reasons.some((r) => r.toLowerCase().includes('limited nearby resources'))) {
      reasons.push(`+ Limited nearby resources`);
    }
  }

  resourceScore = Math.min(10, Math.max(0, resourceScore));
  breakdown.resourceAvailability = {
    score: resourceScore,
    max: 10,
    availableAmbulances,
    hospitalCapacityPercent,
    reason: resourceScore > 0 ? 'Constrained emergency response resources' : 'Adequate response units available'
  };

  // -------------------------------------------------------------
  // Total Score & Tier Classification
  // -------------------------------------------------------------
  const rawScore = severityScore + affectedScore + medicalScore + vulnerableScore + envScore + resourceScore;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));
  const level = classifyPriorityTier(score);

  // If reasons list is empty (e.g. baseline incident), supply a clear baseline reason
  if (reasons.length === 0) {
    reasons.push(`+ Routine non-escalated ${emergencyType} hazard`);
  }

  return {
    score,
    level,
    reasons,
    breakdown,
    tier: PRIORITY_TIERS[level]
  };
}

export default {
  calculatePriorityScore,
  classifyPriorityTier,
  PRIORITY_TIERS
};
