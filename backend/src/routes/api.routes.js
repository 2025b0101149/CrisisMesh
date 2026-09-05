import { Router } from 'express';
import healthRoutes from './health.routes.js';
import incidentRoutes from './incident.routes.js';

const router = Router();

// Health check endpoint -> /api/health
router.use('/health', healthRoutes);

// Incident Management -> /api/incidents
router.use('/incidents', incidentRoutes);

// Future endpoints will be mounted here:
// router.use('/auth', authRoutes);
// router.use('/resources', resourceRoutes);
// router.use('/ai', aiRoutes);

export default router;
