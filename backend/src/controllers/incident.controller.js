import incidentService from '../services/incident.service.js';
import { emitIncidentCreated, emitIncidentUpdated } from '../server.js';

const VALID_EMERGENCY_TYPES = [
  'Flood',
  'Fire',
  'Structural Collapse',
  'Medical',
  'Hazardous Materials',
  'Wildfire',
  'Mass Transit',
  'Utility Failure',
  'Other'
];

const VALID_SECTORS = [
  'Sector 1',
  'Sector 2',
  'Sector 3',
  'Sector 4',
  'Sector 5'
];

/**
 * Validates incident creation payload
 */
const validateIncidentInput = (body) => {
  const errors = [];

  // Emergency Type
  if (!body.emergencyType) {
    errors.push('Emergency type is required.');
  } else if (!VALID_EMERGENCY_TYPES.includes(body.emergencyType)) {
    errors.push(`Emergency type must be one of: ${VALID_EMERGENCY_TYPES.join(', ')}`);
  }

  // Description
  if (!body.description || body.description.trim().length < 5) {
    errors.push('Description must be at least 5 characters long.');
  }

  // Location
  const address = body.location?.address || body.address;
  if (!address || address.trim().length === 0) {
    errors.push('Incident address or landmark is required.');
  }

  const sector = body.location?.sector || body.sector;
  if (sector && !VALID_SECTORS.includes(sector)) {
    errors.push(`Sector must be one of: ${VALID_SECTORS.join(', ')}`);
  }

  // Numbers
  if (body.peopleAffected !== undefined && (isNaN(body.peopleAffected) || Number(body.peopleAffected) < 0)) {
    errors.push('Number of people affected must be 0 or a positive number.');
  }

  if (body.peopleInjured !== undefined && (isNaN(body.peopleInjured) || Number(body.peopleInjured) < 0)) {
    errors.push('Number of injured people must be 0 or a positive number.');
  }

  return errors;
};

/**
 * @route POST /api/incidents
 * @desc Create a new citizen or responder emergency incident
 */
export const createIncident = async (req, res, next) => {
  try {
    const validationErrors = validateIncidentInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const newIncident = await incidentService.createIncident(req.body);

    res.status(201).json({
      success: true,
      message: 'Emergency incident successfully registered and dispatched to EOC queue.',
      incidentId: newIncident.incidentId,
      data: newIncident
    });

    try {
      emitIncidentCreated(newIncident);
    } catch (err) {
      console.error('Socket emit error on incident create:', err);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/incidents
 * @desc Fetch all incidents with optional query filters
 */
export const getIncidents = async (req, res, next) => {
  try {
    const { status, priority, sector, search } = req.query;
    const incidents = await incidentService.getAllIncidents({ status, priority, sector, search });

    res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/incidents/:id
 * @desc Fetch single incident details
 */
export const getIncidentById = async (req, res, next) => {
  try {
    const incident = await incidentService.getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: `Incident '${req.params.id}' not found in active emergency registry.`
      });
    }

    res.status(200).json({
      success: true,
      data: incident
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/incidents/:id
 * @desc Update incident status, priority, or assigned units
 */
export const updateIncident = async (req, res, next) => {
  try {
    const updated = await incidentService.updateIncident(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Incident '${req.params.id}' not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Incident record updated successfully.',
      data: updated
    });

    try {
      emitIncidentUpdated(updated);
    } catch (err) {
      console.error('Socket emit error on incident update:', err);
    }
  } catch (error) {
    next(error);
  }
};
