import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Publicacion } from '../entities/Publicacion';

const pubRepo = AppDataSource.getRepository(Publicacion);

export const getPublicaciones = async (_req: Request, res: Response) => {
  const publicaciones = await pubRepo.find();
  res.json(publicaciones);
};

export const createPublicacion = async (req: Request, res: Response) => {
  try {
    const nueva = pubRepo.create(req.body);
    const saved = await pubRepo.save(nueva);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'No se pudo crear la publicación', detalles: err });
  }
};
