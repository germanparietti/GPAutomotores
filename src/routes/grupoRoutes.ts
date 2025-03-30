import { Router } from 'express';
import { getGrupos, createGrupo,actualizarSolicitud } from '../controllers/grupoController';

const router = Router();

router.get('/', getGrupos);
router.post('/', createGrupo);
router.patch('/:id/solicitud', actualizarSolicitud);

export default router;
