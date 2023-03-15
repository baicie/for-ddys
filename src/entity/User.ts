import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export type UserRoleType = 'admin' | 'editor' | 'ghost';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  /** 唯一标识 */
  userid!: string;

  @Column()
  role!: UserRoleType;

  @Column()
  username!: string;

  @Column()
  password!: string;
}
