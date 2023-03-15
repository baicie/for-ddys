import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Play } from './Play';

@Entity()
export class Movice {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({})
  img?: string;

  @Column()
  title?: string;

  @Column()
  local?: string;

  @OneToMany(() => Play, (play) => play.id)
  plays?: Play[];
}
