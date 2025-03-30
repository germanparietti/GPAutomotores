import { Router } from 'express';
import { getGrupos, createGrupo,actualizarSolicitud, resetEstadosGrupos } from '../controllers/grupoController';

const router = Router();

router.get('/', getGrupos);
router.post('/', createGrupo);
router.patch('/:id/solicitud', actualizarSolicitud);
router.patch('/reset-estados', resetEstadosGrupos);
export default router;
