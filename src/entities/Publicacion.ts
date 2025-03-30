import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Publicacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  texto!: string;
}
