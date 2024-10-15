import express from 'express';
import dbConnect from './config/dbConnect.js';
import routes from './routes/index.js';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import handler404 from './middleware/handler404.js';

dbConnect();

const app = express();
app.use(cors());
app.use(express.json());
routes(app);

app.use(handler404);

app.use(errorHandler);



export default app