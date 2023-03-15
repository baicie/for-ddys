import { Movice } from './Movie';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Infor {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  tag?: string;

  @Column()
  title?: string;

  @Column()
  sart?: string;

  @Column()
  text?: string;

  @Column()
  same?: string;

  @OneToOne(() => Movice)
  @JoinColumn()
  profile?: Movice;
}