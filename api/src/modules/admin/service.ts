import { UserService } from '@/modules/user/service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '@/modules/user/entity';
import { SelectQueryBuilder } from 'typeorm';
import { AdminServiceI } from '@/shares';

@Injectable()
export class AdminService extends UserService implements AdminServiceI {
  async updateOne(id: number, data: Partial<UserEntity>) {
    try {
      return super.updateOne(id, data);
    } catch (error) {
      if (
        error.code === '23505' &&
        error.constraint === 'IDX_user_email_active'
      ) {
        throw new BadRequestException(
          'Email is already in use by another active user',
        );
      }
      throw error;
    }
  }

  protected handleWhere(
    query: SelectQueryBuilder<UserEntity>,
    condition: Partial<Record<keyof UserEntity, any>>,
  ): SelectQueryBuilder<UserEntity> {
    return super.handleWhere(query, { ...condition, role: 'admin' });
  }
}
