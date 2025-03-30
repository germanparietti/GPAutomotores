import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Grupo } from '../entities/Grupo';
import { SolicitudEstado } from '../enums/SolicitudEstado';

const grupoRepo = AppDataSource.getRepository(Grupo);

export const getGrupos = async (_req: Request, res: Response) => {
  const grupos = await grupoRepo.find();
  res.json(grupos);
};

export const createGrupo = async (req: Request, res: Response) => {
  try {
    const { url, nombre, cantidad, solicitud } = req.body;

    const existente = await grupoRepo.findOneBy({ url });
    if (existente) {
      return res.status(409).json({ error: 'El grupo ya existe en la base de datos.' });
    }

    const nuevo = grupoRepo.create({
      url,
      nombre,
      cantidad,
      solicitud: solicitud || SolicitudEstado.PENDIENTE
    });

    const saved = await grupoRepo.save(nuevo);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'No se pudo crear el grupo', detalles: err });
  }
};

export const actualizarSolicitud = async (req: Request, res: Response) => {
  const grupoRepo = AppDataSource.getRepository(Grupo);
  const { id } = req.params;
  const { solicitud } = req.body;

  if (!Object.values(SolicitudEstado).includes(solicitud)) {
    return res.status(400).json({ error: 'Valor de solicitud inválido.' });
  }

  try {
    const grupo = await grupoRepo.findOneBy({ id: Number(id) });
    if (!grupo) {
      return res.status(404).json({ error: 'Grupo no encontrado.' });
    }

    grupo.solicitud = solicitud;
    await grupoRepo.save(grupo);

    res.json({ mensaje: 'Solicitud actualizada correctamente.', grupo });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la solicitud.', detalles: err });
  }
};

export const resetEstadosGrupos = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: 'Debes enviar un array de IDs' });
    }

    const grupoRepo = AppDataSource.getRepository(Grupo);
    const grupos = await grupoRepo.findByIds(ids);

    for (const grupo of grupos) {
      grupo.estado = 0;
      await grupoRepo.save(grupo);
    }

    res.json({ message: 'Estados reseteados correctamente', grupos });
  } catch (error) {
    console.error('Error al resetear estados:', error);
    res.status(500).json({ message: 'Error al resetear estados' });
  }
};
