import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  created_at: Date;

  @Column({
    name: 'created_by',
    type: 'bigint',
    nullable: true,
  })
  created_by: number | null;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updated_at: Date;

  @Column({
    name: 'updated_by',
    type: 'bigint',
    nullable: true,
  })
  updated_by: number | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
  })
  deleted_at: Date;

  @Column({
    name: 'deleted_by',
    type: 'bigint',
    nullable: true,
  })
  deleted_by: number | null;

  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;
}
