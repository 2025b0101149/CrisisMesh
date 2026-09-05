import mongoose from 'mongoose';
import Incident from '../models/incident.model.js';
import { calculatePriorityScore } from './priorityEngine.service.js';

// Pre-seeded initial incidents with transparent Emergency Priority Engine scores & reasons
let inMemoryIncidents = [
  {
    incidentId: 'INC-8492',
    emergencyType: 'Flood',
    title: 'Flash Flood & Stranded Families in Residential Sector',
    description: 'Rapid water level surge (6.2 ft) threatening residential structures. Immediate extraction required.',
    location: {
      address: '442 Riverside Way, Lowland Basin',
      sector: 'Sector 4',
      coordinates: { lat: 37.7749, lng: -122.4194, x: 38, y: 62 }
    },
    peopleAffected: 24,
    peopleInjured: 4,
    peopleTrapped: 14,
    isMedicalEmergency: true,
    imageUrl: '',
    contactInfo: { name: 'Elena Rostova', phone: '+1 (555) 234-5678', isAnonymous: false },
    priority: 'CRITICAL',
    priorityScore: 91,
    priorityReasons: [
      '+ Large number of people affected (24 individuals)',
      '+ Medical emergency',
      '+ Limited nearby resources',
      '+ High number of trapped victims (14 individuals requiring extrication)'
    ],
    priorityBreakdown: {
      severity: { score: 25, max: 30, reason: 'Flood surge hazard' },
      peopleAffected: { score: 15, max: 20, reason: '24 people affected' },
      medicalUrgency: { score: 25, max: 25, reason: 'Medical emergency with 14 trapped' },
      vulnerablePopulations: { score: 10, max: 15, reason: 'Vulnerable families present' },
      environmentalConditions: { score: 6, max: 10, reason: 'Rising water level' },
      resourceAvailability: { score: 10, max: 10, reason: 'Limited rescue boats' }
    },
    status: 'In Progress',
    assignedUnits: ['Swiftwater Rescue Team 2', 'Ambulance MED-04'],
    requiredResources: ['Inflatable Rescue Boats (2)', 'Hypothermia Warming Kits (20)'],
    aiTriageSummary: 'Gemini Triage Model: Rapid water level surge (6.2 ft) threatening 3 residential structures. Immediate watercraft extraction prioritized.',
    timeline: [
      { time: '12m ago', event: 'Incident reported via citizen mobile dispatch portal' },
      { time: '10m ago', event: 'Priority Engine calculated Score 91/100 (CRITICAL); immediate dispatch protocol' },
      { time: '8m ago', event: 'Swiftwater Rescue Team 2 dispatched from Station 04' }
    ],
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  },
  {
    incidentId: 'INC-8493',
    emergencyType: 'Hazardous Materials',
    title: 'Multi-Vehicle Collision with Chemical Fuel Spill',
    description: 'Flammable hydrocarbon plume detected following tanker breach. Risk of vapor ignition.',
    location: {
      address: 'Highway 101 Northbound & Exit 28 Overpass',
      sector: 'Sector 1',
      coordinates: { lat: 37.7833, lng: -122.4167, x: 68, y: 25 }
    },
    peopleAffected: 15,
    peopleInjured: 7,
    peopleTrapped: 3,
    isMedicalEmergency: true,
    imageUrl: '',
    contactInfo: { name: 'Officer D. Martinez', phone: '+1 (555) 890-1234', isAnonymous: false },
    priority: 'CRITICAL',
    priorityScore: 89,
    priorityReasons: [
      '+ Severe hazard type: Hazardous Materials',
      '+ Large number of people affected (15 individuals)',
      '+ Medical emergency (3 critical casualties)',
      '+ Limited nearby resources'
    ],
    priorityBreakdown: {
      severity: { score: 25, max: 30, reason: 'Hazardous chemical plume' },
      peopleAffected: { score: 15, max: 20, reason: '15 people affected' },
      medicalUrgency: { score: 25, max: 25, reason: '3 trapped, 7 injured' },
      vulnerablePopulations: { score: 0, max: 15, reason: 'None' },
      environmentalConditions: { score: 10, max: 10, reason: 'Plume spread hazard' },
      resourceAvailability: { score: 14, max: 10, reason: 'Hazmat units dispatched' }
    },
    status: 'Active',
    assignedUnits: ['Hazmat Unit 01', 'Engine 14', 'Ambulance MED-01'],
    requiredResources: ['Foam Fire Suppression Unit (1)', 'Chemical Neutralizing Agent (500L)'],
    aiTriageSummary: 'Gemini Triage Model: Hydrocarbon plume detected. Recommend immediate 400m perimeter lockdown and evacuation.',
    timeline: [
      { time: '24m ago', event: 'Highway patrol triggered direct emergency priority broadcast' },
      { time: '20m ago', event: 'Priority Engine assigned Score 89/100 (CRITICAL); Hazmat Unit 01 assigned' }
    ],
    createdAt: new Date(Date.now() - 24 * 60 * 1000).toISOString()
  },
  {
    incidentId: 'INC-8494',
    emergencyType: 'Structural Collapse',
    title: 'Commercial Complex Structural Collapse after Seismic Tremor',
    description: 'Pancake collapse of western wing following aftershock. Acoustic monitors detecting tapping.',
    location: {
      address: '710 Grand Plaza Boulevard',
      sector: 'Sector 2',
      coordinates: { lat: 37.7651, lng: -122.4312, x: 52, y: 44 }
    },
    peopleAffected: 45,
    peopleInjured: 18,
    peopleTrapped: 8,
    isMedicalEmergency: true,
    imageUrl: '',
    contactInfo: { name: 'Marcus Vance', phone: '+1 (555) 345-9876', isAnonymous: false },
    priority: 'CRITICAL',
    priorityScore: 94,
    priorityReasons: [
      '+ Severe hazard type: Structural Collapse',
      '+ Large number of people affected (45 people)',
      '+ Medical emergency',
      '+ Limited nearby resources',
      '+ High number of trapped victims (8 individuals requiring extrication)'
    ],
    priorityBreakdown: {
      severity: { score: 30, max: 30, reason: 'Structural Collapse' },
      peopleAffected: { score: 15, max: 20, reason: '45 people affected' },
      medicalUrgency: { score: 25, max: 25, reason: '5 critical, 8 trapped' },
      vulnerablePopulations: { score: 10, max: 15, reason: 'Multiple workers trapped' },
      environmentalConditions: { score: 8, max: 10, reason: 'Seismic aftershock risk' },
      resourceAvailability: { score: 6, max: 10, reason: 'Heavy USAR units required' }
    },
    status: 'In Progress',
    assignedUnits: ['Urban Search & Rescue Alpha', 'K9 Search Unit 3', 'Ambulance MED-08'],
    requiredResources: ['Acoustic Listening Devices (4)', 'Shoring Timber & Pneumatic Struts'],
    aiTriageSummary: 'Gemini Triage Model: Structural pancaking of levels 1 and 2. Void spaces identified along western concrete pillars.',
    timeline: [
      { time: '45m ago', event: 'Seismic monitor alarm triggered automatic incident creation' },
      { time: '38m ago', event: 'Priority Engine calculated Score 94/100 (CRITICAL); USAR Alpha deployed' }
    ],
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  }
];

let incidentCounter = 8495;

/**
 * Service to handle Incident database operations with MongoDB and fallback support
 */
export class IncidentService {
  isDbConnected() {
    return mongoose.connection.readyState === 1;
  }

  generateIncidentId() {
    incidentCounter += 1;
    return `INC-${incidentCounter}`;
  }

  /**
   * Evaluate incident with the Emergency Priority Engine
   */
  evaluatePriority(incidentData) {
    return calculatePriorityScore(
      incidentData,
      incidentData.environmentalConditions || {},
      incidentData.resourceContext || {}
    );
  }

  generateTriageSummary(data, priorityResult) {
    const reasonsStr = priorityResult.reasons.slice(0, 2).join('; ');
    return `Priority Engine: Score ${priorityResult.score}/100 (${priorityResult.level}). ${reasonsStr}. Immediate dispatch protocol initiated for ${data.location?.sector || 'target sector'}.`;
  }

  /**
   * Create and persist a new incident
   */
  async createIncident(incidentData) {
    const incidentId = this.generateIncidentId();
    const priorityEval = this.evaluatePriority(incidentData);
    const priority = incidentData.priority || priorityEval.level;
    const priorityScore = incidentData.priorityScore !== undefined ? Number(incidentData.priorityScore) : priorityEval.score;
    const priorityReasons = incidentData.priorityReasons && incidentData.priorityReasons.length > 0
      ? incidentData.priorityReasons
      : priorityEval.reasons;
    const priorityBreakdown = incidentData.priorityBreakdown || priorityEval.breakdown;
    const aiTriageSummary = incidentData.aiTriageSummary || this.generateTriageSummary(incidentData, priorityEval);

    const fullData = {
      incidentId,
      emergencyType: incidentData.emergencyType,
      description: incidentData.description,
      location: {
        address: incidentData.location?.address || incidentData.address || 'Address unconfirmed',
        sector: incidentData.location?.sector || incidentData.sector || 'Sector 2',
        coordinates: incidentData.location?.coordinates || {
          lat: incidentData.lat || 37.7749,
          lng: incidentData.lng || -122.4194,
          x: Math.floor(Math.random() * 60) + 20,
          y: Math.floor(Math.random() * 60) + 20
        }
      },
      peopleAffected: Number(incidentData.peopleAffected || 0),
      peopleInjured: Number(incidentData.peopleInjured || 0),
      peopleTrapped: Number(incidentData.peopleTrapped || 0),
      isMedicalEmergency: Boolean(incidentData.isMedicalEmergency),
      imageUrl: incidentData.imageUrl || '',
      contactInfo: {
        name: incidentData.contactInfo?.name || incidentData.reporterName || 'Anonymous Citizen',
        phone: incidentData.contactInfo?.phone || incidentData.reporterPhone || '',
        isAnonymous: Boolean(incidentData.contactInfo?.isAnonymous ?? incidentData.isAnonymous)
      },
      priority,
      priorityScore,
      priorityReasons,
      priorityBreakdown,
      vulnerablePopulation: incidentData.vulnerablePopulation || {
        hasVulnerable: Boolean(incidentData.hasVulnerable || incidentData.childrenCount > 0 || incidentData.elderlyCount > 0),
        childrenCount: Number(incidentData.childrenCount || 0),
        elderlyCount: Number(incidentData.elderlyCount || 0),
        disabledCount: Number(incidentData.disabledCount || 0)
      },
      environmentalConditions: incidentData.environmentalConditions || {
        weather: incidentData.weather || 'Normal',
        isNight: Boolean(incidentData.isNight),
        secondaryHazards: incidentData.secondaryHazards || []
      },
      status: incidentData.status || 'Active',
      assignedUnits: incidentData.assignedUnits || [],
      requiredResources: incidentData.requiredResources || [
        incidentData.isMedicalEmergency ? 'Paramedic Ambulance Unit' : 'First Responder Engine'
      ],
      aiTriageSummary,
      timeline: [
        {
          time: 'Just now',
          event: `Incident reported with Priority Score ${priorityScore}/100 (${priority})`,
          timestamp: new Date()
        }
      ]
    };

    if (this.isDbConnected()) {
      const doc = new Incident(fullData);
      await doc.save();
      return doc.toObject();
    } else {
      const memoryDoc = {
        ...fullData,
        _id: 'mem_' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryIncidents.unshift(memoryDoc);
      return memoryDoc;
    }
  }

  /**
   * Get all incidents with optional filters
   */
  async getAllIncidents(filters = {}) {
    if (this.isDbConnected()) {
      const query = {};
      if (filters.status && filters.status !== 'ALL') query.status = filters.status;
      if (filters.priority && filters.priority !== 'ALL') query.priority = filters.priority;
      if (filters.sector && filters.sector !== 'ALL') query['location.sector'] = filters.sector;
      if (filters.search) {
        query.$or = [
          { incidentId: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
          { 'location.address': { $regex: filters.search, $options: 'i' } }
        ];
      }
      return await Incident.find(query).sort({ createdAt: -1 });
    } else {
      let list = [...inMemoryIncidents];
      if (filters.status && filters.status !== 'ALL') {
        list = list.filter((i) => i.status === filters.status);
      }
      if (filters.priority && filters.priority !== 'ALL') {
        list = list.filter((i) => i.priority === filters.priority);
      }
      if (filters.sector && filters.sector !== 'ALL') {
        list = list.filter((i) => i.location?.sector === filters.sector);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (i) =>
            i.incidentId.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.location?.address.toLowerCase().includes(q)
        );
      }
      return list;
    }
  }

  /**
   * Get incident by ID (supports incidentId or mongo _id)
   */
  async getIncidentById(id) {
    if (this.isDbConnected()) {
      let doc = await Incident.findOne({ incidentId: id });
      if (!doc && mongoose.Types.ObjectId.isValid(id)) {
        doc = await Incident.findById(id);
      }
      return doc ? doc.toObject() : null;
    } else {
      return inMemoryIncidents.find((i) => i.incidentId === id || i._id === id) || null;
    }
  }

  /**
   * Update incident (status, assignedUnits, priority, casualties)
   */
  async updateIncident(id, updateData) {
    const current = await this.getIncidentById(id);
    if (!current) return null;

    let priorityPayload = {};
    if (
      updateData.peopleInjured !== undefined ||
      updateData.peopleAffected !== undefined ||
      updateData.peopleTrapped !== undefined ||
      updateData.isMedicalEmergency !== undefined ||
      updateData.emergencyType !== undefined
    ) {
      const merged = { ...current, ...updateData };
      const priorityEval = this.evaluatePriority(merged);
      priorityPayload = {
        priorityScore: priorityEval.score,
        priority: priorityEval.level,
        priorityReasons: priorityEval.reasons,
        priorityBreakdown: priorityEval.breakdown
      };
    }

    const timelineEvent = updateData.status
      ? { time: 'Just now', event: `Status updated to ${updateData.status}`, timestamp: new Date() }
      : updateData.assignedUnit
      ? { time: 'Just now', event: `Unit '${updateData.assignedUnit}' assigned`, timestamp: new Date() }
      : priorityPayload.priorityScore !== undefined && priorityPayload.priorityScore !== current.priorityScore
      ? { time: 'Just now', event: `Priority re-evaluated: ${priorityPayload.priorityScore}/100 (${priorityPayload.priority})`, timestamp: new Date() }
      : null;

    const finalUpdate = {
      ...updateData,
      ...priorityPayload
    };

    if (this.isDbConnected()) {
      const updatePayload = { ...finalUpdate };
      if (timelineEvent) {
        updatePayload.$push = { timeline: { $each: [timelineEvent], $position: 0 } };
      }
      let doc = await Incident.findOneAndUpdate(
        { incidentId: id },
        updatePayload,
        { new: true, runValidators: true }
      );
      if (!doc && mongoose.Types.ObjectId.isValid(id)) {
        doc = await Incident.findByIdAndUpdate(id, updatePayload, { new: true, runValidators: true });
      }
      return doc ? doc.toObject() : null;
    } else {
      const idx = inMemoryIncidents.findIndex((i) => i.incidentId === id || i._id === id);
      if (idx === -1) return null;

      const updated = {
        ...inMemoryIncidents[idx],
        ...finalUpdate,
        timeline: timelineEvent ? [timelineEvent, ...(inMemoryIncidents[idx].timeline || [])] : inMemoryIncidents[idx].timeline,
        updatedAt: new Date().toISOString()
      };
      inMemoryIncidents[idx] = updated;
      return updated;
    }
  }
}

export default new IncidentService();
