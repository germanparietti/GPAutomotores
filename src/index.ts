import 'reflect-metadata';
import { app } from './app';
import { AppDataSource } from './config/data-source';
import dotenv from 'dotenv';
import { iniciarScheduler } from './jobs/scheduler'; // <- nuevo

dotenv.config();

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Conexión a la base de datos establecida.');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      iniciarScheduler(); // ← inicia el scheduler cuando el server levanta
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar con la base de datos:', error);
  });
