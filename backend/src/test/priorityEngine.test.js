/**
 * CrisisMesh Emergency Priority Engine Unit Tests
 * 
 * Verifies:
 * - 0 to 100 scoring accuracy
 * - Classification tiers:
 *     80-100 = CRITICAL (🔴)
 *     60-79  = HIGH     (🟠)
 *     40-59  = MEDIUM   (🟡)
 *     0-39   = LOW      (🟢)
 * - Transparent reason breakdown (e.g. "+ Large number of people affected", "+ Medical emergency", "+ Limited nearby resources")
 * - Edge case handling & mathematical bounds clamping [0, 100]
 */

import { calculatePriorityScore, classifyPriorityTier } from '../services/priorityEngine.service.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n======================================================');
console.log('--- CrisisMesh Emergency Priority Engine Test Suite ---');
console.log('======================================================\n');

// -------------------------------------------------------------
// Test 1: Tier Classification Boundary Values
// -------------------------------------------------------------
console.log('Test 1: Tier Classification Boundaries');
assert(classifyPriorityTier(100) === 'CRITICAL', '100 is classified as CRITICAL');
assert(classifyPriorityTier(80) === 'CRITICAL', '80 is classified as CRITICAL');
assert(classifyPriorityTier(79) === 'HIGH', '79 is classified as HIGH');
assert(classifyPriorityTier(60) === 'HIGH', '60 is classified as HIGH');
assert(classifyPriorityTier(59) === 'MEDIUM', '59 is classified as MEDIUM');
assert(classifyPriorityTier(40) === 'MEDIUM', '40 is classified as MEDIUM');
assert(classifyPriorityTier(39) === 'LOW', '39 is classified as LOW');
assert(classifyPriorityTier(0) === 'LOW', '0 is classified as LOW');

// -------------------------------------------------------------
// Test 2: CRITICAL Incident (User Example match: Score ~91, CRITICAL, reasons)
// -------------------------------------------------------------
console.log('\nTest 2: CRITICAL Incident Calculation & Reason Generation');
const criticalIncident = {
  emergencyType: 'Structural Collapse',
  description: 'Pancake collapse with trapped victims and active hazard',
  peopleAffected: 45,
  isMedicalEmergency: true,
  criticalCasualties: 4,
  peopleTrapped: 6,
  peopleInjured: 12,
  vulnerablePopulation: {
    hasVulnerable: true,
    childrenCount: 3,
    elderlyCount: 2
  },
  environmentalConditions: {
    weather: 'Storm with heavy rain',
    isNight: true,
    secondaryHazards: ['Aftershocks detected']
  },
  limitedResources: true
};

const criticalResult = calculatePriorityScore(criticalIncident, {}, {
  sectorAvailableAmbulances: 0,
  hospitalCapacityPercent: 95
});

console.log(`  Calculated Score: ${criticalResult.score}/100`);
console.log(`  Classified Level: ${criticalResult.level}`);
console.log(`  Reasons Output:`);
criticalResult.reasons.forEach((r) => console.log(`    ${r}`));

assert(criticalResult.score >= 80 && criticalResult.score <= 100, `CRITICAL score within [80, 100] (Actual: ${criticalResult.score})`);
assert(criticalResult.level === 'CRITICAL', 'Level is CRITICAL');
assert(criticalResult.reasons.some((r) => r.includes('people affected')), 'Includes reason for people affected');
assert(criticalResult.reasons.some((r) => r.includes('medical emergency') || r.includes('Medical')), 'Includes reason for medical emergency');
assert(criticalResult.reasons.some((r) => r.includes('Limited nearby resources') || r.includes('resources')), 'Includes reason for limited nearby resources');
assert(criticalResult.reasons.some((r) => r.includes('vulnerable') || r.includes('children')), 'Includes reason for vulnerable populations');

// -------------------------------------------------------------
// Test 3: HIGH Incident (Score 60 - 79)
// -------------------------------------------------------------
console.log('\nTest 3: HIGH Priority Incident');
const highIncident = {
  emergencyType: 'Fire',
  description: 'Brush wildfire approaching perimeter of timberland community with heavy smoke and active fire spread',
  peopleAffected: 20,
  isMedicalEmergency: false,
  peopleInjured: 2,
  peopleTrapped: 0,
  criticalCasualties: 0,
  environmentalConditions: {
    weather: 'Gale wind gusts',
    isNight: false
  },
  limitedResources: true
};

const highResult = calculatePriorityScore(highIncident, {}, {
  availableAmbulances: 3,
  sectorAvailableAmbulances: 1
});

console.log(`  Calculated Score: ${highResult.score}/100`);
console.log(`  Classified Level: ${highResult.level}`);
console.log(`  Reasons Output:`);
highResult.reasons.forEach((r) => console.log(`    ${r}`));

assert(highResult.score >= 60 && highResult.score <= 79, `HIGH score within [60, 79] (Actual: ${highResult.score})`);
assert(highResult.level === 'HIGH', `Level is HIGH (Actual: ${highResult.level})`);
assert(highResult.reasons.length > 0, 'Reasons list generated');

// -------------------------------------------------------------
// Test 4: MEDIUM Incident (Score 40 - 59)
// -------------------------------------------------------------
console.log('\nTest 4: MEDIUM Priority Incident');
const mediumIncident = {
  emergencyType: 'Utility Failure',
  description: 'Substation transformer failure causing local power outage and hazard in commercial block',
  urgency: 'urgent',
  peopleAffected: 12,
  isMedicalEmergency: false,
  peopleInjured: 1,
  peopleTrapped: 0,
  criticalCasualties: 0
};

const mediumResult = calculatePriorityScore(mediumIncident);

console.log(`  Calculated Score: ${mediumResult.score}/100`);
console.log(`  Classified Level: ${mediumResult.level}`);
console.log(`  Reasons Output:`);
mediumResult.reasons.forEach((r) => console.log(`    ${r}`));

assert(mediumResult.score >= 40 && mediumResult.score <= 59, `MEDIUM score within [40, 59] (Actual: ${mediumResult.score})`);
assert(mediumResult.level === 'MEDIUM', `Level is MEDIUM (Actual: ${mediumResult.level})`);

// -------------------------------------------------------------
// Test 5: LOW Incident (Score 0 - 39)
// -------------------------------------------------------------
console.log('\nTest 5: LOW Priority Incident');
const lowIncident = {
  emergencyType: 'Other',
  description: 'Minor non-hazardous water main seepage along sidewalk curb',
  peopleAffected: 0,
  isMedicalEmergency: false,
  peopleInjured: 0,
  peopleTrapped: 0,
  criticalCasualties: 0
};

const lowResult = calculatePriorityScore(lowIncident);

console.log(`  Calculated Score: ${lowResult.score}/100`);
console.log(`  Classified Level: ${lowResult.level}`);
assert(lowResult.score >= 0 && lowResult.score <= 39, `LOW score within [0, 39] (Actual: ${lowResult.score})`);
assert(lowResult.level === 'LOW', `Level is LOW (Actual: ${lowResult.level})`);

// -------------------------------------------------------------
// Test 6: Extreme Boundary and Clamping Test
// -------------------------------------------------------------
console.log('\nTest 6: Extreme Inputs & Clamping');
const extremeIncident = {
  emergencyType: 'Structural Collapse',
  description: 'Catastrophic explosion and collapse with multiple trapped',
  peopleAffected: 5000,
  criticalCasualties: 50,
  peopleTrapped: 100,
  peopleInjured: 300,
  isMedicalEmergency: true,
  vulnerablePopulation: {
    childrenCount: 200,
    elderlyCount: 150
  },
  environmentalConditions: {
    weather: 'Hurricane force winds and torrential storm surge',
    isNight: true,
    secondaryHazards: ['Toxic plume', 'Downed power lines']
  },
  limitedResources: true
};

const clampedResult = calculatePriorityScore(extremeIncident);
assert(clampedResult.score === 100, `Extreme incident capped at exactly 100 (Actual: ${clampedResult.score})`);
assert(clampedResult.level === 'CRITICAL', 'Extreme incident classified as CRITICAL');

// Negative numbers check
const negativeIncident = {
  emergencyType: 'Other',
  peopleAffected: -50,
  peopleInjured: -10,
  peopleTrapped: -5
};
const negativeResult = calculatePriorityScore(negativeIncident);
assert(negativeResult.score >= 0 && negativeResult.score <= 100, `Negative inputs handled safely (Actual: ${negativeResult.score})`);

// -------------------------------------------------------------
// Test 7: Factor Breakdown Verification
// -------------------------------------------------------------
console.log('\nTest 7: Factor Breakdown Completeness');
const factorKeys = ['severity', 'peopleAffected', 'medicalUrgency', 'vulnerablePopulations', 'environmentalConditions', 'resourceAvailability'];
for (const key of factorKeys) {
  assert(criticalResult.breakdown[key] !== undefined, `Breakdown includes factor: ${key}`);
  assert(typeof criticalResult.breakdown[key].score === 'number', `Factor ${key} score is numeric`);
}

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n======================================================');
console.log(`Test Results: ${passed} passed, ${failed} failed.`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL UNIT TESTS PASSED SUCCESSFULLY! 🎉\n');
  process.exit(0);
}
