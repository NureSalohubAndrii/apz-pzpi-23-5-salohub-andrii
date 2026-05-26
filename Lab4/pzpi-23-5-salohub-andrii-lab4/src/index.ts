import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.config';
import cookieParser from 'cookie-parser';
import usersRoutes from './modules/users/users.routes';
import authRoutes from './modules/auth/auth.routes';
import carsRoutes from './modules/cars/cars.routes';
import eventsRoutes from './modules/events/events.routes';
import reportsRoutes from './modules/reports/reports.routes';
import adminRoutes from './modules/admin/admin.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import iotRoutes from './modules/iot/iot.routes';
import { errorHandler } from './shared/middlewares/error.middleware';

console.log('Starting Vehicle History API server...');

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/iot', iotRoutes);

app.get('/', (_, res) => {
  res.json({
    success: true,
    message: 'Vehicle History API is running',
    version: '1.0.0',
    docs: '/api/docs',
  });
});

app.get('/health', (_, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    machineId: process.env.FLY_MACHINE_ID ?? 'local',
    region: process.env.FLY_REGION ?? 'local',
  });
});

app.use(errorHandler);

app.use((_, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

const PORT = Number(process.env.PORT) || 3000;
const machineId = process.env.FLY_MACHINE_ID ?? 'local';
const region = process.env.FLY_REGION ?? 'local';

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Machine: ${machineId} (region: ${region})`);
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`Network: http://192.168.1.5:${PORT}`);
});
