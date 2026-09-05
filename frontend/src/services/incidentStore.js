import { io } from 'socket.io-client';
import api from './api';
import {
  INITIAL_INCIDENTS,
  HOSPITALS,
  AMBULANCES,
  RESCUE_TEAMS,
  SUPPLIES_INVENTORY,
  HAZARD_ZONES
} from '../data/mockData';

const STORAGE_KEY_INCIDENTS = 'crisismesh_incidents_v1';

// In production, VITE_API_URL points to the public Render backend (e.g. https://crisismesh-api.onrender.com)
const getBackendUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    return apiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  }
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
};

const BACKEND_URL = getBackendUrl();

// Listeners for in-memory updates
const listeners = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error('Store listener notification error:', err);
    }
  });
}

function normalizeIncident(doc) {
  if (!doc) return null;
  const id = doc.incidentId || doc.id || (doc._id ? String(doc._id) : `INC-${Date.now()}`);
  const injured = doc.peopleInjured ?? doc.casualties?.injured ?? 0;
  const trapped = doc.peopleTrapped ?? doc.casualties?.trapped ?? 0;
  const critical = doc.casualties?.critical ?? 0;

  return {
    ...doc,
    id: id,
    incidentId: id,
    title: doc.title || `${doc.emergencyType || doc.category || 'Emergency'} Incident`,
    category: doc.emergencyType || doc.category || 'General Emergency',
    emergencyType: doc.emergencyType || doc.category || 'Other',
    priority: doc.priority || 'HIGH',
    priorityScore: doc.priorityScore ?? 75,
    status: doc.status || 'Active',
    location: {
      address: doc.location?.address || doc.address || 'Reported Location',
      sector: doc.location?.sector || doc.sector || 'Sector 2',
      coordinates: doc.location?.coordinates || {
        lat: doc.lat || 37.7749,
        lng: doc.lng || -122.4194,
        x: Math.floor(Math.random() * 60) + 20,
        y: Math.floor(Math.random() * 60) + 20
      },
      lat: doc.location?.coordinates?.lat || doc.lat || 37.7749,
      lng: doc.location?.coordinates?.lng || doc.lng || -122.4194
    },
    reportedAt: doc.reportedAt || 'Just now',
    timestamp: doc.createdAt || doc.timestamp || new Date().toISOString(),
    reporter: {
      name: doc.contactInfo?.name || doc.reporter?.name || doc.reporterName || 'Citizen Reporter',
      phone: doc.contactInfo?.phone || doc.reporter?.phone || doc.reporterPhone || 'Not provided',
      verified: Boolean(doc.reporter?.verified)
    },
    casualties: {
      injured: Number(injured),
      trapped: Number(trapped),
      critical: Number(critical)
    },
    assignedUnits: doc.assignedUnits || [],
    requiredResources: doc.requiredResources || ['Paramedic Unit (1)'],
    aiTriageSummary:
      doc.aiTriageSummary ||
      'Gemini Pre-Triage: Initial triage assigned. Dispatch protocols active.',
    timeline:
      doc.timeline && doc.timeline.length > 0
        ? doc.timeline
        : [{ time: 'Just now', event: 'Incident recorded in dispatch system' }]
  };
}

// In-memory incidents array
let inMemoryIncidents = [];

function loadStoredIncidents() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_INCIDENTS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeIncident);
      }
    }
  } catch (e) {
    console.warn('Failed to parse incidents from localStorage');
  }
  return INITIAL_INCIDENTS.map(normalizeIncident);
}

inMemoryIncidents = loadStoredIncidents();

function saveIncidents(incidents) {
  inMemoryIncidents = incidents;
  try {
    localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents));
  } catch (e) {
    console.warn('Could not save incidents to localStorage');
  }
  notifyListeners();
}

function upsertIncident(incident) {
  const normalized = normalizeIncident(incident);
  const existingIdx = inMemoryIncidents.findIndex(
    (i) => i.id === normalized.id || i.incidentId === normalized.incidentId
  );

  let updatedList;
  if (existingIdx !== -1) {
    updatedList = [...inMemoryIncidents];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...normalized };
  } else {
    updatedList = [normalized, ...inMemoryIncidents];
  }
  saveIncidents(updatedList);
}

// Socket.IO real-time client connection
let socket = null;
try {
  socket = io(BACKEND_URL, {
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 10,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('⚡ Connected to CrisisMesh Socket.IO server at', BACKEND_URL);
  });

  socket.on('incident:created', (incident) => {
    console.log('⚡ [Socket.IO] incident:created event received:', incident);
    upsertIncident(incident);
  });

  socket.on('incident:updated', (incident) => {
    console.log('⚡ [Socket.IO] incident:updated event received:', incident);
    upsertIncident(incident);
  });
} catch (e) {
  console.warn('Socket.IO initialization skipped or failed:', e);
}

// Initial fetch from backend API
async function fetchIncidentsFromAPI() {
  try {
    const res = await api.get('/incidents');
    if (res.data && Array.isArray(res.data.data)) {
      const backendIncidents = res.data.data.map(normalizeIncident);
      if (backendIncidents.length > 0) {
        // Merge with existing
        const map = new Map();
        // Add backend ones first
        backendIncidents.forEach((inc) => map.set(inc.id, inc));
        // Add any local ones that don't collide
        inMemoryIncidents.forEach((inc) => {
          if (!map.has(inc.id)) {
            map.set(inc.id, inc);
          }
        });
        saveIncidents(Array.from(map.values()));
      }
    }
  } catch (err) {
    console.log('Initial API fetch /incidents notice:', err.message || 'Offline or server booting');
  }
}

// Trigger initial sync
fetchIncidentsFromAPI();

/**
 * Incident & Resource Store (localStorage + Real Backend API + Socket.IO)
 */
export const incidentStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getIncidents() {
    return inMemoryIncidents;
  },

  getIncidentById(id) {
    return inMemoryIncidents.find((item) => item.id === id || item.incidentId === id) || null;
  },

  async refresh() {
    await fetchIncidentsFromAPI();
    return inMemoryIncidents;
  },

  async addIncident(incidentData) {
    const fallbackId = `INC-${8500 + inMemoryIncidents.length + 1}`;
    const payload = {
      emergencyType: incidentData.emergencyType || incidentData.category || 'Other',
      description:
        incidentData.description ||
        incidentData.title ||
        `${incidentData.category || 'Emergency'} reported near ${incidentData.address || 'location'}.`,
      location: {
        address: incidentData.address || incidentData.location?.address || 'Reported Location',
        sector: incidentData.sector || incidentData.location?.sector || 'Sector 2'
      },
      peopleAffected: Number(
        incidentData.peopleAffected ??
          ((Number(incidentData.injured) || 0) + (Number(incidentData.trapped) || 0) || 1)
      ),
      peopleInjured: Number(incidentData.peopleInjured ?? (Number(incidentData.injured) || 0)),
      peopleTrapped: Number(incidentData.peopleTrapped ?? (Number(incidentData.trapped) || 0)),
      isMedicalEmergency: Boolean(
        incidentData.isMedicalEmergency ??
          (Number(incidentData.critical) > 0 || Number(incidentData.injured) > 0)
      ),
      contactInfo: {
        name: incidentData.reporterName || 'Citizen Reporter',
        phone: incidentData.reporterPhone || 'Not provided',
        isAnonymous: Boolean(incidentData.isAnonymous)
      },
      priority: incidentData.priority || 'HIGH'
    };

    try {
      const res = await api.post('/incidents', payload);
      if (res.data && res.data.data) {
        const savedIncident = normalizeIncident(res.data.data);
        upsertIncident(savedIncident);
        return savedIncident;
      }
    } catch (err) {
      console.warn('Backend API POST /incidents failed, using local store:', err.message);
    }

    // Fallback if backend API is offline
    const localIncident = normalizeIncident({
      ...incidentData,
      incidentId: fallbackId,
      id: fallbackId,
      status: 'Active',
      createdAt: new Date().toISOString()
    });
    upsertIncident(localIncident);
    return localIncident;
  },

  async updateIncidentStatus(id, newStatus) {
    // Optimistic local update
    const updated = inMemoryIncidents.map((item) => {
      if (item.id === id || item.incidentId === id) {
        return {
          ...item,
          status: newStatus,
          timeline: [
            { time: 'Just now', event: `Status updated to ${newStatus}` },
            ...item.timeline
          ]
        };
      }
      return item;
    });
    saveIncidents(updated);

    // Call backend PUT /api/incidents/:id
    try {
      await api.put(`/incidents/${id}`, { status: newStatus });
    } catch (err) {
      console.warn(`Backend PUT /incidents/${id} status error:`, err.message);
    }

    return this.getIncidentById(id);
  },

  async assignUnit(id, unitName) {
    const updated = inMemoryIncidents.map((item) => {
      if (item.id === id || item.incidentId === id) {
        const units = item.assignedUnits.includes(unitName)
          ? item.assignedUnits
          : [...item.assignedUnits, unitName];
        return {
          ...item,
          status: item.status === 'Active' ? 'Dispatched' : item.status,
          assignedUnits: units,
          timeline: [
            { time: 'Just now', event: `Unit '${unitName}' assigned to incident` },
            ...item.timeline
          ]
        };
      }
      return item;
    });
    saveIncidents(updated);

    try {
      await api.put(`/incidents/${id}`, { assignedUnit: unitName });
    } catch (err) {
      console.warn(`Backend PUT /incidents/${id} unit assignment error:`, err.message);
    }
  },

  getHospitals() {
    return HOSPITALS;
  },

  getAmbulances() {
    return AMBULANCES;
  },

  getRescueTeams() {
    return RESCUE_TEAMS;
  },

  getSupplies() {
    return SUPPLIES_INVENTORY;
  },

  getHazardZones() {
    return HAZARD_ZONES;
  },

  getDashboardKPIs() {
    const incidents = this.getIncidents();
    const activeIncidents = incidents.filter(
      (i) => i.status !== 'Resolved' && i.status !== 'resolved'
    );
    const criticalIncidents = activeIncidents.filter((i) => i.priority === 'CRITICAL');
    const highPriorityIncidents = activeIncidents.filter((i) => i.priority === 'HIGH');

    const ambulances = this.getAmbulances();
    const availableAmbulances = ambulances.filter((a) => a.status === 'Available').length;
    const totalAmbulances = ambulances.length;

    const rescueTeams = this.getRescueTeams();
    const activeRescueTeams = rescueTeams.filter((r) => r.status === 'Deployed').length;
    const totalRescueTeams = rescueTeams.length;

    const hospitals = this.getHospitals();
    const totalHospitalBeds = hospitals.reduce((acc, h) => acc + h.totalBeds, 0);
    const availableHospitalBeds = hospitals.reduce((acc, h) => acc + h.availableBeds, 0);
    const totalIcuBeds = hospitals.reduce((acc, h) => acc + h.icuTotal, 0);
    const availableIcuBeds = hospitals.reduce((acc, h) => acc + h.icuAvailable, 0);

    const supplies = this.getSupplies();
    const totalSupplies = supplies.reduce((acc, s) => acc + s.total, 0);
    const availableSupplies = supplies.reduce((acc, s) => acc + s.available, 0);
    const availableResourcesPercentage = Math.round((availableSupplies / totalSupplies) * 100);

    return {
      totalActiveIncidents: activeIncidents.length,
      criticalIncidents: criticalIncidents.length,
      highPriorityIncidents: highPriorityIncidents.length,
      resolvedIncidents: incidents.filter(
        (i) => i.status === 'Resolved' || i.status === 'resolved'
      ).length,
      availableResourcesPercentage,
      activeRescueTeams,
      totalRescueTeams,
      availableAmbulances,
      totalAmbulances,
      hospitalAvailabilityPercentage: Math.round((availableHospitalBeds / totalHospitalBeds) * 100),
      availableHospitalBeds,
      totalHospitalBeds,
      availableIcuBeds,
      totalIcuBeds
    };
  }
};
