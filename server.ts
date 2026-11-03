import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './server/routes/authRoutes.js';
import equipmentRoutes from './server/routes/equipmentRoutes.js';
import bookingRoutes from './server/routes/bookingRoutes.js';
import userRoutes from './server/routes/userRoutes.js';
import notificationRoutes from './server/routes/notificationRoutes.js';
import reportRoutes from './server/routes/reportRoutes.js';
import { dbStore } from './server/db/store.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic CORS headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // REST API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/equipment', equipmentRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/reports', reportRoutes);

  // Database Connection & System Health endpoints
  app.get('/api/system/db-status', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: dbStore.getDatabaseStatus(),
    });
  });

  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      database: 'connected',
      system: 'Smart Classroom Equipment Booking System',
      version: '1.0.0',
      dbSummary: dbStore.getDatabaseStatus(),
      timestamp: new Date().toISOString(),
    });
  });

  // Vite Dev Server middleware or Static production serving
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true' ? false : false,
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Classroom Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
