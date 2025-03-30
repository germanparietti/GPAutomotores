import express from 'express';
import cors from 'cors';
import routes from './routes';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes); // Todas las rutas van a salir desde /api
