import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Grupo } from './Grupo';

@Entity()
export class Publicacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  texto!: string;

  @ManyToMany(() => Grupo, grupo => grupo.publicaciones)
@JoinTable()
grupos!: Grupo[];
}
