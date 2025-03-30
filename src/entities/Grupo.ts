import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToMany  } from 'typeorm';
import { SolicitudEstado } from '../enums/SolicitudEstado';
import { Publicacion } from './Publicacion';

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
  @ManyToMany(() => Publicacion, publicacion => publicacion.grupos)
publicaciones!: Publicacion[];
}
