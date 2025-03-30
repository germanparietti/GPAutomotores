import { Router } from 'express';
import grupoRoutes from './grupoRoutes';
import publicacionRoutes from './publicacionRoutes';
import botRoutes from './botRoutes';

const router = Router();

router.get('/', (_req, res) => {
  res.send('✅ API funcionando correctamente');
});

router.use('/grupos', grupoRoutes);
router.use('/publicaciones', publicacionRoutes);
router.use('/ejecutar-bot', botRoutes);

export default router;
