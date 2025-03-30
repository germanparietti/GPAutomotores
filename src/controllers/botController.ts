import { Request, Response } from 'express';
import { ejecutarBot } from '../jobs/publicadorService';

export const ejecutarBotHandler = async (_req: Request, res: Response) => {
  try {
    await ejecutarBot();
    res.status(200).json({ mensaje: '✅ Bot ejecutado manualmente con éxito.' });
  } catch (error) {
    console.error('❌ Error al ejecutar el bot manualmente:', error);
    res.status(500).json({ error: 'Ocurrió un error al ejecutar el bot.' });
  }
};
