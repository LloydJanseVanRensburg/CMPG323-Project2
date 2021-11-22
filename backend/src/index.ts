//=========================================IMPORTS======================================================
// ENV Variables served to app
import dotenv from 'dotenv';
dotenv.config();

// 3rd Party Modules
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

// Database connection file
const db = require('./models/index');

// Custom Middleware
import apiErrorHandler from './middleware/apiErrorHandler';

// Route Imports
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import groupRoutes from './routes/groupRoutes';
import albumRoutes from './routes/albumRoutes';
import postRoutes from './routes/postRoutes';
import imageRoutes from './routes/imageRoutes';
import { AuthMiddleware } from './middleware/AuthMiddleware';
import { PostControllers } from './controllers/PostControllers';
import { upload } from './middleware/FileUploadMiddleware';
//============================================================================================================

// Init Express App
const app = express();

// Set up basic middlewares
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json());

// App Routing Middleware
app.post(
  '/api/v1/post/uploads',
  cors({ origin: 'http://172.104.244.191:3000' }),
  AuthMiddleware.auth,
  upload.array('image'),
  PostControllers.uploadPostImages
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/albums', albumRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/image', imageRoutes);

// App Global Error Handler Middleware
app.use(apiErrorHandler);

// Init Server and listen
const PORT = process.env.PORT || 3001;

// Database Connection and Server Startup
db.sequelize
  .authenticate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server runnning on port ${PORT}`);
    });
  })
  .catch((e: any) => {
    console.log(' \n\nDATABASE CONNECTION ERROR 💥🚨!!\n\n');
    console.log(e);
    process.exit(1);
  });
