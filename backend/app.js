import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import authRoutes from './modules/auth/auth.routes.js';

const app = express();

app.use(helmet());           // SEO + Security
app.use(compression());      // Performance
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

export default app;
