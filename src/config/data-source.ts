import { DataSource } from 'typeorm';
import { Grupo } from '../entities/Grupo';
import { Publicacion } from '../entities/Publicacion';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  dropSchema:false,
  logging: false,
  entities: [Grupo, Publicacion],
});
