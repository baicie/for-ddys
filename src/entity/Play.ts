import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movice } from './Movie';

export enum PlayType {
  ZP = 'zheng_pian',
  HD = 'hd',
  CQ = 'chao_qing',
}

@Entity()
export class Play {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({
    type: 'enum',
    enum: PlayType,
    default: PlayType.ZP,
  })
  type?: PlayType;

  @Column()
  plya?: string;

  @Column()
  site?: string;

  @ManyToOne(() => Movice, (movice) => movice.plays)
  movice?: Movice;
}
