import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { SolicitudEstado } from '../enums/SolicitudEstado';

@Entity()
export class Grupo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Index({ unique: true })
  @Column()
  url!: string;

  @Column({ default: 0 })
  estado!: number;

  @Column({ nullable: true })
  cantidad!: number;

  @Column({
    type: 'enum',
    enum: SolicitudEstado,
    default: SolicitudEstado.PENDIENTE
  })
  solicitud!: SolicitudEstado;
}
