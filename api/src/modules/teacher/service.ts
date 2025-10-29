import { UserService } from '@/modules/user/service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '@/modules/user/entity';
import { SelectQueryBuilder } from 'typeorm';
import { Role, TeacherServiceI } from '@/shares';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TeacherService extends UserService implements TeacherServiceI {
  async updateOne(id: number, data: Partial<UserEntity>) {
    const curUserId = this.getAuthenticatedUserId();
    const curRole = this.getAuthenticatedRole();
    if (curUserId !== id && curRole !== Role.ADMIN) {
      throw new HttpException(
        'You are not authorized to update this user',
        HttpStatus.FORBIDDEN,
      );
    }

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

  async softDelete(id: number) {
    const curUserId = this.getAuthenticatedUserId();
    const curRole = this.getAuthenticatedRole();
    if (curUserId !== id && curRole !== Role.ADMIN) {
      throw new HttpException(
        'You are not authorized to delete this user',
        HttpStatus.FORBIDDEN,
      );
    }
    return super.softDelete(id);
  }

  protected handleWhere(
    query: SelectQueryBuilder<UserEntity>,
    condition: Partial<Record<keyof UserEntity, any>>,
  ): SelectQueryBuilder<UserEntity> {
    return super.handleWhere(query, { ...condition, role: 'teacher' });
  }
}
