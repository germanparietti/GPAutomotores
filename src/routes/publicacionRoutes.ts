import { Router } from 'express';
import { getPublicaciones, createPublicacion } from '../controllers/publicacionController';

const router = Router();

router.get('/', getPublicaciones);
router.post('/', createPublicacion);

export default router;
