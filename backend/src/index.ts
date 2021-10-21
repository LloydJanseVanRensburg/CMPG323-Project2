import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import util from 'util';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import apiErrorHandler from './middleware/apiErrorHandler';
import initParse from './utils/initParse';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import groupRoutes from './routes/groupRoutes';
import postRoutes from './routes/postRoutes';
import { getFileStream } from './middleware/FileUploadMiddleware';

export const unlinkFile = util.promisify(fs.unlink);

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/posts', postRoutes);

// Loading All Image Request From AWS S3 and pipe it to client
app.get('/api/v1/image/:key', (req: Request, res: Response) => {
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

app.use(apiErrorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  initParse();

  console.log(`Server runnning on port ${PORT}`);
});
