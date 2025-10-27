import { BaseEntity } from '@/modules/base/entity';
import { UserEntity } from '@/modules/user/entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('password_reset_token')
export class PasswordResetTokenEntity extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ unique: true })
  token: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  // Relationship: many tokens can belong to one user
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
