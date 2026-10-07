import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models';
import authRoutes from './routes/authRoutes';
import subjectRoutes from './routes/subjectRoutes';
import taskRoutes from './routes/taskRoutes';
import noteRoutes from './routes/noteRoutes';
import aiRoutes from './routes/aiRoutes';
import { apiReference } from '@scalar/express-api-reference';
import { openApiSpec } from './docs/openapi';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Scalar API Reference Documentation
app.get('/openapi.json', (_req: Request, res: Response) => {
  res.json(openApiSpec);
});

app.use(
  '/docs',
  apiReference({
    spec: {
      content: openApiSpec,
    },
  })
);

app.use(
  '/reference',
  apiReference({
    spec: {
      content: openApiSpec,
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync database models
    await sequelize.sync();
    console.log('Database synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Scalar API Docs available at http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
