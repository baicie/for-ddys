import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Base {
  @PrimaryGeneratedColumn()
  /** 唯一标识 */
  id!: string;

  @Column()
  /** 标题 */
  title!: string;

  @Column()
  /** 描述 */
  description!: string;

  @Column()
  /** 类型 */
  type!: string;

  @Column()
  /** 状态 */
  status!: string;

  @Column()
  /** 封面 */
  image!: string;

  @Column()
  /** 创建时间 */
  createTime!: string;

  @Column()
  /** 标签 */
  lable!: string;

  @Column()
  /** 标签 */
  range!: string;
}
