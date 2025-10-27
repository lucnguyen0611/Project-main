import { UserService } from '@/modules/user/service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '@/modules/user/entity';
import { SelectQueryBuilder } from 'typeorm';
import { Role, StudentServiceI } from '@/shares';

@Injectable()
export class StudentService extends UserService implements StudentServiceI {
  protected handleWhere(
    query: SelectQueryBuilder<UserEntity>,
    condition: Partial<Record<keyof UserEntity, any>>,
  ): SelectQueryBuilder<UserEntity> {
    return super.handleWhere(query, { ...condition, role: 'student' });
  }

  async updateOne(id: number, data: Partial<UserEntity>) {

    const curUserId = this.getAuthenticatedUserId();
    const curRole = this.getAuthenticatedRole();

    if(curUserId !== id && curRole !== Role.ADMIN){
      throw new HttpException('You are not authorized to update this user', HttpStatus.FORBIDDEN);
    }
    return super.updateOne(id, data);
  }

  async softDelete(id: number) {

    const curUserId = this.getAuthenticatedUserId();
    const curRole = this.getAuthenticatedRole();
    if(curUserId !== id && curRole !== Role.ADMIN){
      throw new HttpException('You are not authorized to delete this user', HttpStatus.FORBIDDEN);
    }
    return super.softDelete(id);
  }
}
