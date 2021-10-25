// ENV Variables served to app
import dotenv from 'dotenv';
dotenv.config();

// Core Node
import fs from 'fs';
import util from 'util';

// 3rd Party Modules
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';

// Custom Middleware
import apiErrorHandler from './middleware/apiErrorHandler';

// Route Imports
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import groupRoutes from './routes/groupRoutes';
import postRoutes from './routes/postRoutes';
import imageRoutes from './routes/imageRoutes';

// DB Connection Function
import { connectDB } from './config/db';

export const unlinkFile = util.promisify(fs.unlink);

// Init Express App
const app = express();

// Set up basic middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// App Routing Middleware
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/image', imageRoutes);

// App Global Error Handler Middleware
app.use(apiErrorHandler);

// Init Server and listen
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server runnning on port ${PORT}`);
});
