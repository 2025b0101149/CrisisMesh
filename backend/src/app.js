import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import { corsOptions } from './config/cors.js';
import apiRouter from './routes/api.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Enable Cross-Origin Resource Sharing with configured frontend origin
app.use(cors(corsOptions));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware (supporting image uploads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'CrisisMesh API Gateway',
    version: '1.0.0',
    description: 'AI-Powered Emergency Response & Resource Coordination Platform',
    documentation: '/api/health'
  });
});

// Primary API Router mounted at /api
app.use('/api', apiRouter);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
