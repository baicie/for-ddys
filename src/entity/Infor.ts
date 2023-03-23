import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movice } from './Movie';

@Entity()
export class Infor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  tag?: string;

  @Column()
  title?: string;

  @Column()
  sart?: string;

  @Column({
    length: 1000,
  })
  text?: string;

  @OneToOne(() => Movice)
  @JoinColumn()
  movice?: Movice;
}
