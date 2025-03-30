import { Router } from 'express';
import { ejecutarBotHandler } from '../controllers/botController';

const router = Router();

router.get('/', ejecutarBotHandler);

export default router;
