import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import apiErrorHandler from './middleware/apiErrorHandler';
import initParse from './utils/initParse';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import groupRoutes from './routes/groupRoutes';
import postRoutes from './routes/postRoutes';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/posts', postRoutes);

app.use(apiErrorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  initParse();

  console.log(`Server runnning on port ${PORT}`);
});
