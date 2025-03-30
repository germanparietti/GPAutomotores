import cron from 'node-cron';
import { ejecutarBot } from './publicadorService';

export const iniciarScheduler = () => {
  console.log('📅 Job scheduler iniciado');
  ejecutarBot()
  // ⏱️ Ejecutar cada 30 minutos (formato cron)
  cron.schedule('*/30 * * * *', async () => {
    console.log('🔁 Ejecutando bot automáticamente (cada 30 min)');
    await ejecutarBot();
  });

  // 📌 EJEMPLOS (puedes cambiarlo):
  // '*/10 * * * *' → cada 10 minutos
  // '0 * * * *' → cada hora
  // '0 9 * * *' → todos los días a las 9:00am
};
