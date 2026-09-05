import { Router } from 'express';
import {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident
} from '../controllers/incident.controller.js';

const router = Router();

// /api/incidents
router.route('/')
  .post(createIncident)
  .get(getIncidents);

// /api/incidents/:id
router.route('/:id')
  .get(getIncidentById)
  .put(updateIncident);

export default router;
